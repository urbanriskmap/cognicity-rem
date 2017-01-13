import { bindable, bindingMode, inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';

import * as L from 'leaflet';

import { API } from './api';
import { tokenIsExpired, getProfile } from './utils';

// Import environment variables
import env from './environment';

// Read map config from environment
const config = env.mapConfig;

// Highlight a specific feature
const highlightFeature = (e) => {
  let layer = e.target;
  layer.setStyle({
    weight: 2,
    color: '#2e6da4',
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
    this.profile = getProfile();
    this.loading = true;
    this.refreshing = true;
    this.districts = null;
    this.tableData = null;
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

    L.control.scale({position:'bottomright', metric:true, imperial:false}).addTo(this.map);

    var mapKey = L.Control.extend({
      options: {
        position:'bottomright'
      },
      onAdd: function(map) {
        var container = L.DomUtil.create('div', 'info legend');
	       container.innerHTML += '<div id="heightsLegend"><div class="sublegend"><div style="font-weight:bold">Tinggi Banjir</div><div><i class="color" style="background:#CC2A41;"></i><span>&nbsp;&gt; 150 cm</span></div><div><i class="color" style="background:#FF8300"></i><span>&nbsp;71 cm &ndash; 150 cm </span></div><div><i class="color" style="background:#FFFF00"></i><span>&nbsp;10 cm &ndash; 70 cm</span></div><i class="color" style="background:#A0A9F7"></i><span>&nbsp;RWs</span></div></div>';        return container;
      }
    });

    this.map.addControl(new mapKey);

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
            case 1: return { ...style, fillColor:"#CC2A41",weight:1,color:"#CC2A41", opacity:0.8,fillOpacity: 0.8};
            case 2: return { ...style, fillColor:"#FF8300",weight:1,color:"#FF8300", opacity:0.8,fillOpacity: 0.8};
            case 3: return { ...style, fillColor:"#FFFF00",weight:1,color:"#FFFF00", opacity:0.8,fillOpacity: 0.8};
            case 4: return { ...style, fillColor:"#CC2A41",weight:1,color:"#CC2A41", opacity:0.8,fillOpacity: 0.8};
            default: return {...style, color:"#444",weight:0.2,opacity:1,fillOpacity:0};
          }
        },
        onEachFeature: (feature, layer) => {
          // Assign the area_id as the unique id for the layer
          layer._leaflet_id = feature.properties.area_id;

          // Assign behaviours to the layer
          layer.on({
            mouseover: highlightFeature,
            mouseout: (e) => {
              // Reset highlights on the flood layer
              this.floodLayer.resetStyle(e.target);
            },
            click: (e) => {
              // Zoom to a given feature
              this.map.fitBounds(e.target.getBounds());

              // Update the selected area and selected district
              this.selectedArea = this.floods.features.find((flood) =>
                flood.properties.area_id === e.target.feature.properties.area_id)
              this.selectedDistrict = this.selectedArea.properties.parent_name;
              this.districtChanged(this.selectedDistrict);

              // Select the area in the table
              this.selectedArea.$isSelected = true;
              this.tableApi.revealItem(this.selectedArea);
            }
          });
        }
      }).addTo(this.map);;

      // Fit the bounds to flood layer
      this.map.fitBounds(this.floodLayer.getBounds())

      // Initialise the districts list
      this.initDistricts();

      // Refresh flood reports layer then schedule to update automatically
      this.refreshFloodReports();
      setTimeout(() => this.refreshFloodReports(), config.reports_refresh);

      // Updated refreshing status
      this.refreshing = false;
    })
    .catch((err) => {
      this.error = err.message;
      this.refreshing = false;
    });

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
          // Disabled default infrastructure on the map
          //infrastructure.default && layer.addTo(this.map);
        }));
    }

    // Add layers control once all layer promises have been resolved
    Promise.all(layerPromises).then(() => {
      L.control.layers(basemapLayers, infrastructureLayers, {
        position: 'bottomleft',
        collapsed: false
      }).addTo(this.map);
      this.loading = false;
    }).catch((err) => {
      this.error = err.message;
      this.loading = false;
    });
  }

  // Can this view be activated i.e. is there a valid token?
  canActivate() {
    // Check if token is expired and redirect if so
    if (tokenIsExpired()) return new Redirect('/');
    return true;
  }

  // Get a distinct list of districts from the floods data, sorted alphabetically
  initDistricts() {
    this.districts = Array.from(new Set(this.floods.features.map(flood => flood.properties.parent_name))).sort();
  }

  // Refresh the tableData to reflect the new district
  districtChanged(district) {
    this.tableData = this.floods.features
      .filter((flood) => flood.properties.parent_name === district)
      .sort((a, b) => {
        if (a.properties.area_name < b.properties.area_name)
        return -1;
        if (a.properties.area_name > b.properties.area_name)
        return 1;
        return 0;
      });
  }

  // Refresh the current flood states
  refreshFloodStates() {
    // If no floods then return
    if (!this.floods) return;

    // Start the spinner
    this.refreshing = true;

    this.api.getFloodStates().then((data) => {
      // Clear all existing states
      for (let flood of this.floods.features) flood.properties.state = null;

      // Update floods with new state
      for (let floodState of data.result) {
        let flood = this.floods.features.find((flood) =>
          flood.properties.area_id === floodState.area_id);
        if (flood) flood.properties.state = floodState.state;
      }

      // Stop the spinner
      this.refreshing = false;
    });
  }

  // Refresh flood reports
  refreshFloodReports() {
    // Start the spinner
    this.refreshing = true;

    this.api.getReports().then((data) => {
      // Refresh the reports map layer
      this.reportsLayer.clearLayers();
      this.reportsLayer.addData(data);

      // Initialise report counts
      this.initReportCounts();

      // Assign new report counts
      this.assignReportCounts(data);

      // Stop the spinner
      this.refreshing = false;
    });
  }

  // Clear the report counts for areas and districts
  initReportCounts() {
    for (let flood of this.floods.features) flood.properties.reports = 0;
  }

  // Assign report counts to reflect the new reports
  assignReportCounts(reports) {
    // Return if we do not have the data we need
    if (!reports || !this.floods) return;

    for (let report of reports.features) {
      // Find the flood object associated with the report
      let flood = this.floods.features.find((flood) =>
        flood.properties.area_id === report.properties.tags.local_area_id);

      // Increment the reports count
      flood && flood.properties.reports++;
    }
  }

  // When an area has been selected in the table, select the area on the map
  areaSelectedInTable($event) {
    this.selectedArea = $event.detail.row;
    let layer = this.floodLayer.getLayer(this.selectedArea.properties.area_id);
    if (layer) layer.fireEvent('click');
  }

  // Set the state with the new state value
  floodStateChanged(area) {
    // Start the spinner
    this.refreshing = true;

    // If the new status is null then delete, otherwise update
    let promises = [];
    let username = this.profile ? this.profile.email : 'rem';
    if (area.properties.state > 0) {
      promises.push(this.api.updateFloodState(area.properties.area_id, area.properties.state, username));
    } else {
      promises.push(this.api.deleteFloodState(area.properties.area_id, username));
    }

    // Once the API action has been resolved refresh the table and map
    Promise.all(promises).then((data) => {
        // Refresh the flood states
        this.refreshFloodStates();
        // FIXME: Map needs to update to reflect the new status
        // FIXME: There is a small lag between the update and table refresh and looks a little glitchy
        // Stop the spinner
        this.refreshing = false;
      })
      .catch((err) => {
        this.error = err.message;
        this.refreshing = false;
      });
  }

  // Iterate through all non null states and clear the state with a DELETE
  clearFloodStates() {
    // If no floods then return
    if (!this.floods) return;

    // Make sure the user really wants to clear all flood states
    // TODO: Replace with a nicer dialog e.g. https://github.com/aurelia/dialog
    let ok = confirm('Are you sure you want to clear all flood states?');
    if (!ok) return;

    // Start the spinner
    this.refreshing = true;

    // Filter out the flooded states
    let flooded = this.floods.features.filter((flood) => flood.properties.state);

    // Generate a delete request for each
    let promises = flooded.map((flood) =>
      this.api.deleteFloodState(flood.properties.area_id, this.profile ? this.profile.email : 'rem'));

    // When all flood states have been cleared...
    Promise.all(promises).then(() => {
      // Refresh the flood states
      this.refreshFloodStates();

      // Stop the spinner
      this.refreshing = false;
    }).catch((err) => {
      this.error = err.message;
      this.refreshing = false;
    });
  }
}
