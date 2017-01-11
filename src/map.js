import { inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';

import * as L from 'leaflet';
import * as erd from 'element-resize-detector';

import { API } from './api';
import { tokenIsExpired } from './utils';

// Import environment variables
import env from './environment';

// Read map config from environment
const config = env.mapConfig;

@inject(API, I18N)
export class Map {

  constructor(api, i18n) {
    this.api = api;
    this.i18n = i18n;
    this.pageSize = 5;
    this.loading = true;
    this.refreshing = true;
    // TODO: Improve this, it is a little hacky and does not take into account user reszing their browser
    this.mapHeight = ( window.innerHeight * 0.65 ) - 50;
    this.tableHeight = ( window.innerHeight * 0.35 ) - 50;
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
        }
      });
      this.floodLayer.addTo(this.map);

      // Fit the bounds to flood layer
      this.map.fitBounds(this.floodLayer.getBounds())

      // Populate floods table
      this.populateFloodAreas(this.floods);

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

  // Populate the flood areas, grouping areas by parent
  populateFloodAreas(floods) {
    let self = this;
    let floodsObj = {};
    for (let flood of self.floods.features) {
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
    self.floodAreas = [];
    for (let parent of parents) {
      self.floodAreas.push({
        // Sort by area name
        name: parent,
        reports: floodsObj[parent].sort((a,b) => {
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

  // TODO: Only a user with role=editor can update state
  setState() {

  }

  // TODO: Only a user with role=editor can clear states
  // TODO: Iterate through all non zero states and clear the state with DELETE
  clearStates() {

  }
}
