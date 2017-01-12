import { bindable, bindingMode, inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';

import * as L from 'leaflet';

import { API } from './api';
import { tokenIsExpired } from './utils';

// Import environment variables
import env from './environment';

// Read map config from environment
const config = env.mapConfig;

// Highlight a specific feature
const highlightFeature = (e) => {
  let layer = e.target;
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

@inject(API, I18N)
export class Map {

  @bindable({ defaultBindingMode: bindingMode.twoWay }) selectedDistrict;

  constructor(api, i18n) {
    this.api = api;
    this.i18n = i18n;
    this.pageSize = 5;
    this.loading = true;
    this.refreshing = true;
    this.selectedDistrict = null;
    this.selectedArea = null;
    this.floodStates = env.floodStates;

    // TODO: Improve this, it is a little hacky and does not take into account user reszing their browser
    // Map height should be a 1/3 of usable screen space (less header)
    this.mapHeight = ( window.innerHeight * 0.66 ) - 100;
    // Table height should be half the map height
    this.tableHeight = this.mapHeight * 0.5;
  }

  attached() {

    // Create map
    this.map = L.map('mapContainer', {
      attributionControl: false
    }).fitBounds([config.bounds.sw, config.bounds.ne]);

    // Add basemaps
    let basemapLayers = {};
    for (let basemap of config.basemaps) {
      // Create the layer
      let layer = L.tileLayer(basemap.url, basemap.options).addTo(this.map);
      // Add the layer to the basemaps object
      basemapLayers[basemap.name] = layer;
      // Add first basemap to map
      basemap.default && layer.addTo(this.map);
    }

    // Keep track of all of our layer promises
    let layerPromises = [];

    // Get flood areas
    this.api.getFloods().then((data) => {
      this.floods = data;

      // Add floods layer to map
      this.floodLayer = new L.GeoJSON(this.floods, {
        style: (feature) => {
          let style = {
            stroke: true,
            color: 'grey',
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.1
          };
          switch (feature.properties.state) {
            case 1: return { ...style, color: '#fdcc8a' };
            case 2: return { ...style, color: '#fc8d59' };
            case 3: return { ...style, color: '#e34a33' };
            case 4: return { ...style, color: '#b30000' };
            default: return style;
          }
        },
        onEachFeature: (feature, layer) => {
          layer._leaflet_id = feature.area_id;
          layer.on({
            mouseover: highlightFeature,
            mouseout: (e) => {
              // Reset highlights on the flood layer
              this.floodLayer.resetStyle(e.target);
            },
            click: (e) => {
              // Zoom to a given feature
              this.map.fitBounds(e.target.getBounds());
              // Update the selectedDistrict with the parent district of the feature
              this.selectedDistrict = this.districts.find((element) =>
                element.name === e.target.feature.properties.parent_name);
              // Select the area in the table
              this.selectedArea = this.selectedDistrict.areas.find((element) =>
                element.area_id === e.target.feature.properties.area_id)
              this.selectedArea.$isSelected = true;
              this.tableApi.revealItem(this.selectedArea);
            }
          });
        }
      });
      this.floodLayer.addTo(this.map);

      // Fit the bounds to flood layer
      this.map.fitBounds(this.floodLayer.getBounds())

      // Populate floods table
      this.populateDistricts(this.floods);

      // Updated refreshing status
      this.refreshing = false;
    })
    .catch((err) => this.error = err.message);

    // Create flood reports layer and add to the map
    this.reportsLayer = new L.GeoJSON(null, {
      pointToLayer: (feature, latlng) =>
      L.marker(latlng, {
        icon: L.icon({
          iconUrl: `assets/icons/floodsIcon.svg`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      })
    });
    this.reportsLayer.addTo(this.map);

    // Refresh flood reports layer then schedule to update automatically
    this.refreshFloodReports();
    setTimeout(() => this.refreshFloodReports(), config.reports_refresh);

    // Add infrastructure layers
    let infrastructureLayers = {};
    for (let infrastructure of config.infrastructure) {
       // Initialise object so that order is consistent
      infrastructureLayers[infrastructure.name] = null;
       // Call the API to get the data storing the promise in an array
      layerPromises.push(this.api.getInfrastructure(infrastructure.type)
        .then((data) => {
          let layer = new L.GeoJSON(data, {
            pointToLayer: (feature, latlng) =>
            L.marker(latlng, {
              icon: L.icon({
                iconUrl: `assets/icons/${infrastructure.type}Icon.svg`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
              })
            })
          });
          infrastructureLayers[infrastructure.name] = layer;
          infrastructure.default && layer.addTo(this.map);
        })
        .catch((err) => this.error = err.message));
    }

    // Add layers control once all layer promises have been resolved
    Promise.all(layerPromises).then(() => {
      L.control.layers(basemapLayers, infrastructureLayers, {
        position: 'bottomleft',
        collapsed: false
      }).addTo(this.map);
      this.loading = false;
    })
  }

  // Can this view be activated i.e. is there a valid token?
  canActivate() {
    // Check if token is expired and redirect if so
    if (tokenIsExpired()) return new Redirect('/');
    return true;
  }

  // Populate the districts and their associated flood areas
  populateDistricts(floods) {
    let floodsObj = {};
    for (let flood of this.floods.features) {
      if (floodsObj[flood.properties.parent_name]) {
        // If the parent exists then add another flood record to it
        floodsObj[flood.properties.parent_name].push(flood.properties);
      } else {
        // Else if no parent record the create one with a new array
        floodsObj[flood.properties.parent_name] = [flood.properties];
      }
    }

    // Get the keys and sort them alphabetically
    let parents = Object.keys(floodsObj);
    parents.sort();

    // Now assign all parents and their corresponding floods to an array
    this.districts = [];
    for (let parent of parents) {
      this.districts.push({
        name: parent,
        areas: floodsObj[parent].sort((a,b) => {
          if (a.area_name < b.area_name)
          return -1;
          if (a.area_name > b.area_name)
          return 1;
          return 0;
        })
      });
    }
  }


  // Refresh the current flood states
  refreshFloodStates() {
    this.refreshing = true;
    this.api.getReports().then((data) => {
      this.reportsLayer.clearLayers();
      this.reportsLayer.addData(data);
      this.refreshing = false;
    });
  }

  // Refresh flood reports
  // TODO: Update report counts against areas
  refreshFloodReports() {
    this.api.getReports().then((data) => {
      this.reportsLayer.clearLayers();
      this.reportsLayer.addData(data);
    });
  }

  // Set the state with the new state value
  setState() {

  }

  // TODO: Only a user with role=editor can clear states
  // TODO: Iterate through all non zero states and clear the state with DELETE
  clearStates() {

  }

  // When an area has been selected in the table, select the area on the map
  areaSelectedInTable($event){
    this.selectedArea = $event.detail.row;
    // FIXME: This interaction is not working as expected
    // let layer = this.floodLayer.getLayer($event.detail.row.area_id);
    // if (layer) layer.fireEvent('click');
  }
}
