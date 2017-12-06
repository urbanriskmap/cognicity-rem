import { bindable, bindingMode, inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';

import * as L from 'leaflet';
import Chart from 'chartjs';

import { API } from './api';
import { tokenIsExpired, getProfile, formatTime } from './utils';
import { loadTable } from './reports';

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
};

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
    this.loadTable = loadTable;
    this.mapHeight = 800; // Set a default height
    this.pageSize = 4;
  }

  resizeComponents() {
    // Map height 2/3 of window - navbar height
    this.mapHeight = 2 * (window.innerHeight - 100) / 3;
    // Table height 1/3 of window - navbar height
    this.tableHeight = window.innerHeight - 100 - this.mapHeight;

    // Set max page size for data table rows
    // Each row is 37px, subtract 1 to leave some bottom margin
    // Limit to 2 rows minimum
    this.pageSize = Math.max(2, Math.floor(this.tableHeight / 37) - 1);
  }

  // Format timestamps to local time
  formatTime(timestampISO8601) {
    let utc = new Date(timestampISO8601).getTime();
    let ict = utc + 3600 * 7 * 1000; // Add 7 hours for UTC+7
    let timestring = new Date(ict).toISOString();
    timestring = timestring.split('T'); // Split time and ate
    let t1 = timestring[1].slice(0, 5); // Extract HH:MM
    let d1 = timestring[0].split('-'); // Extract DD-MM-YY
    let d2 = d1[2] + '-' + d1[1] + '-' + d1[0];
    return (t1 + ' ' + d2);
  }

  updateFloodArea(e) {
    return new Promise((resolve, reject) => {
      let selArea = this.floods.features.find((flood) =>
        flood.properties.area_id === e.target.feature.properties.area_id);

      // Update the selected area and selected district
      this.selectedDistrict = selArea.properties.parent_name;
      this.districtChanged(this.selectedDistrict);
      resolve(selArea);
    });
  }

  attached() {
    // Set height on initiation
    this.resizeComponents();

    // Update height on browser window resize
    window.onresize = () => this.resizeComponents();

    // Create map
    this.map = L.map('mapContainer', {
      attributionControl: false
    }).fitBounds([config.bounds.sw, config.bounds.ne]);

    // Scale
    L.control.scale({
      position: 'bottomright',
      metric: true,
      imperial: false
    }).addTo(this.map);

    // Reports table
    let reportsControl = L.Control.extend({
      options: {
        position: 'bottomleft'
      },
      onAdd: function(map) {
        let div = L.DomUtil.create('div', 'leaflet-control-reports-button');
        div.setAttribute('data-toggle', 'modal');
        div.setAttribute('href', '#reportsModal');

        window.reportsBadge = L.DomUtil.create('span', 'badge progress-bar-danger', div);
        return div;
      }
    });

    this.map.addControl(new reportsControl);

    // Legend
    let mapKey = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      onAdd: function(map) {
        let container = L.DomUtil.create('div', 'info legend');

        // reports
        container.innerHTML += '<div id="reportsLegend"><div class="sublegend"><div><img src="assets/icons/floodsIcon.svg" height="22px;" width="auto" /><span>&nbsp; Laporan Banjir</span></div></div></div>';

        // flood extents
	      container.innerHTML += '<div id="heightsLegend"><div class="sublegend"><div style="font-weight:bold">Tinggi Banjir</div><div><i class="color" style="background:#CC2A41;"></i><span>&nbsp;&gt; 150 cm</span></div><div><i class="color" style="background:#FF8300"></i><span>&nbsp;71 cm &ndash; 150 cm </span></div><div><i class="color" style="background:#FFFF00"></i><span>&nbsp;10 cm &ndash; 70 cm</span></div><i class="color" style="background:#A0A9F7"></i><span>&nbsp;Hati-hati</span></div></div>';

        // gauges
        let gaugeLevelNames = {};
        gaugeLevelNames[1] = 'Siaga I';
        gaugeLevelNames[2] = 'Siaga II';
        gaugeLevelNames[3] = 'Siaga III';
        gaugeLevelNames[4] = 'Siaga IV';
        container.innerHTML += '<div id="gaugesLegend"><div class="sublegend"><div style="font-weight:bold">Tinggi Muka Air</div><div><img src="assets/icons/floodgauge_1.png" height="18px;" width="auto" /><span>&nbsp;'+gaugeLevelNames[1]+'</span></div><div><img src="assets/icons/floodgauge_2.png" height="18px;" width="auto" /><span>&nbsp;'+gaugeLevelNames[2]+'</span></div><div><img src="assets/icons/floodgauge_3.png" height="18px;" width="auto" /><span>&nbsp;'+gaugeLevelNames[3]+'</span></div><div><img src="assets/icons/floodgauge.png" height="18px;" width="auto" /><span>&nbsp;'+gaugeLevelNames[4]+'</span></div></div>';

        return container;
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

    // Keep track of currently selected feature
    this.currentFeature = null;

    // Key a track of area keys vs layer keys
    this.floodDict = {};

    // Get flood areas
    this.api.getFloods().then((data) => {
      this.floods = data;

      // Add floods layer to map
      this.floodLayer = L.geoJSON(this.floods, {
        style: (feature) => {
          let style = {
            stroke: true,
            color: 'grey',
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.1
          };
          switch (feature.properties.state) {
            case 4: return { ...style, fillColor:"#CC2A41",weight:1,color:"#CC2A41", opacity:0.8,fillOpacity: 0.8};
            case 3: return { ...style, fillColor:"#FF8300",weight:1,color:"#FF8300", opacity:0.8,fillOpacity: 0.8};
            case 2: return { ...style, fillColor:"#FFFF00",weight:1,color:"#FFFF00", opacity:0.8,fillOpacity: 0.8};
            case 1: return { ...style, fillColor:"#A0A9F7",weight:1,color:"#A0A9F7", opacity:0.8,fillOpacity: 0.8};
            default: return {...style, color:"#444",weight:0.2,opacity:1,fillOpacity:0};
          }
        },
        onEachFeature: (feature, layer) => {
          // Keep track of Leaflet layers against area_id
          this.floodDict[feature.properties.area_id] = layer;
          // Assign behaviours to the layer
          layer.on({
            mouseover: highlightFeature,
            mouseout: (e) => {
              if (this.currentFeature === null) {
                this.floodLayer.resetStyle(e.target);
              } else if (e.target !== this.currentFeature.target) {
                this.floodLayer.resetStyle(e.target);
              }
            },
            click: (e) => {
              // Release selection of previous feature
              if (this.currentFeature !== null) {
                this.floodLayer.resetStyle(this.currentFeature.target);
              }

              e.target.setStyle({
                weight: 2,
                color: '#2e6da4',
                dashArray: '',
                fillOpacity: 0.7
              });

              // Zoom to a given feature
              this.map.fitBounds(e.target.getBounds(), {maxZoom: 14});

              this.updateFloodArea(e)
              .then((selArea) => {
                // Select the area in the table
                this.selectedArea = selArea;
                this.selectedArea.$isSelected = true;
                this.tableApi.revealItem(selArea);
              });

              this.currentFeature = e;
            }
          });
        }
      }).addTo(this.map);

      // Fit the bounds to flood layer
      this.map.fitBounds(this.floodLayer.getBounds());

      // Initialise the districts list
      this.initDistricts();

      // Refresh flood reports layer then schedule to update automatically
      this.refreshFloodReports();

      // Refresh flood gauges layer then schedule to update automatically
      this.refreshFloodGauges();

      // Updated refreshing status
      this.refreshing = false;
    })
    .catch((err) => {
      this.error = err.message;
      this.refreshing = false;
    });

    this.reportsLayerFeatureMap = {};

    // Create flood reports layer and add to the map
    this.reportsLayer = L.geoJSON(null, {
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: 'assets/icons/floodsIcon.svg',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          })
        });
      },
      onEachFeature: (feature, layer) => {
        this.reportsLayerFeatureMap[feature.properties.pkey] = layer;
        layer.on({
          click: (e) => {
            this.map.setView(e.target._latlng, 15);
            $('#myModal .modal-title').html(feature.properties.title || 'Laporan banjir');
            $('#myModal .modal-body').html('<div id="modalContent"></div>');
            $('#modalContent').append(feature.properties.text);
            if (feature.properties.image_url) {
              $('#modalContent').append("<div><img src='" + feature.properties.image_url + "' width=300px></div>");
            }
            $('#myModal .modal-footer').html(formatTime(feature.properties.created_at));
            $('#myModal').modal();
          }
        });
      }
    });
    this.reportsLayer.addTo(this.map);

    this.gaugeIcons = function(level) {
      switch (level) {
      case 1:
        return {'color': '#FF4000', 'icon': 'assets/icons/floodgauge_1.png'};
      case 2:
        return {'color': '#FF8000', 'icon': 'assets/icons/floodgauge_2.png'};
      case 3:
        return {'color': '#F7D358', 'icon': 'assets/icons/floodgauge_3.png'};
      default:
        return {'color': '#01DF01', 'icon': 'assets/icons/floodgauge.png'};
      }
    };

    // Create flood gauge layer and add to the map
    this.gaugeLayer = L.geoJSON(null, {
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: this.gaugeIcons(feature.properties.observations[feature.properties.observations.length - 1].f3).icon,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
            popupAnchor: [0, 0]
          })
        });
      },
      onEachFeature: (feature, layer) => {
        layer.on({
          click: (e) => {
            $('#myModal .modal-title').html(feature.properties.gaugenameid)
            $('#myModal .modal-body').html('<canvas id="modalChart" width="400" height="200"></canvas>');
            $('#myModal .modal-footer').empty();
            var ctx = $('#modalChart').get(0).getContext("2d");

  					var data = {
  						labels : [],
  						datasets : [{
  							label: "Tinggi Muka Air (cm)",
  							backgroundColor: "rgba(151,187,205,0.2)",
  							borderColor: "rgba(151,187,205,1)",
  							pointBackgroundColor: "rgba(151,187,205,1)",
  							pointBorderColor: "#fff",
  	            pointRadius: 4,
  							data: []
  						}]
  					};
  					for (var i = 0; i < feature.properties.observations.length; i++){
  						data.labels.push(feature.properties.observations[i].f1);
  						data.datasets[0].data.push(feature.properties.observations[i].f2);
  					}
  					var gaugeChart = new Chart(ctx,
  					{type: 'line',
  					data:data,
  					options: {
              bezierCurve:true,
              legend: {display:true},
              scaleLabel: "<%= ' ' + value%>",
              scales: {
                xAxes: [{
                  type: 'time',
                  time: {
                    unit: 'hour',
                    unitStepSize: 1,
                    displayFormats: {
                      'millisecond': 'HH:mm',
              				'second': 'HH:mm',
											'minute': 'HH:mm',
											'hour': 'HH:mm',
											'day': 'HH:mm',
											'week': 'HH:mm',
											'month': 'HH:mm',
											'quarter': 'HH:mm',
											'year': 'HH:mm'
                      }
                    }
                  }]
                },
                tooltips:{
                  enabled: false
                }
  						}
  					});
            $('#myModal').modal();
          }
        });
      }
    }).addTo(this.map);

    // Add infrastructure layers
    let infrastructureLayers = {};
    for (let infrastructure of config.infrastructure) {
       // Initialise object so that order is consistent
      infrastructureLayers[infrastructure.name] = null;
       // Call the API to get the data storing the promise in an array
      layerPromises.push(this.api.getInfrastructure(infrastructure.type)
        .then((data) => {
          let layer = L.geoJSON(data, {
            onEachFeature: (feature, layer) => {
              layer.on({
                click: (e) => {
                  $('#myModal .modal-title').html(infrastructure.name);
                  $('#myModal .modal-body').html(feature.properties.name);
                  $('#myModal').modal();
                }
              });
            },
            pointToLayer: (feature, latlng) => {
              return L.marker(latlng, {
                icon: L.icon({
                  iconUrl: `assets/icons/${infrastructure.type}Icon.svg`,
                  iconSize: [30, 30],
                  iconAnchor: [15, 15]
                })
              });
            }
          });
          infrastructureLayers[infrastructure.name] = layer;
        }));
    }

    // Add layers control once all layer promises have been resolved
    Promise.all(layerPromises).then(() => {
      L.control.layers(basemapLayers, infrastructureLayers, {
        position: 'bottomleft',
        collapsed: true
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
    let targetArea = this.tableData[0].properties.area_id;
    let layer = this.floodLayer.getLayer(this.floodDict[targetArea]._leaflet_id);
    this.map.fitBounds(layer.getBounds(),{maxZoom: 14});

    //this.map.fitBounds(this.tableData[0].geometry)
  }

  // Refresh the current flood states
  refreshFloodStates() {
    console.log('refresh flood states called')
    // If no floods then return
    if (!this.floods) return;
    // Start the spinner
    this.refreshing = true;
    this.api.getFloodStates().then((data) => {

      // Clear the map layer
      this.floodLayer.clearLayers();

      // Check whether updates available from server
      let update = false;
      if (data.result.length > 0) update = true;

      // Next, update flood states
        let i = this.floods.features.length; // Local data to be Updated
        while (i--){ // Fast loop (see https://blogs.oracle.com/greimer/entry/best_way_to_code_a)

          // Set all states to null
          this.floods.features[i].properties.state = null;

          // Only proceed with update if there is new data from the server
          if (update){

            // Now apply updates from server
            let j = data.result.length;
            while (j--){
              if (this.floods.features[i].properties.area_id === data.result[j].area_id){
                this.floods.features[i].properties.state = data.result[j].state
              }
            }
          }
        }
      // Re-add the layer to the map
      this.floodLayer.addData(this.floods);
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

      this.loadTable(data);
      window.reportsBadge.innerHTML = data.features.length;

      // Initialise report counts
      this.initReportCounts();

      // Assign new report counts
      this.assignReportCounts(data);

      // Stop the spinner
      this.refreshing = false;

      // Iterate
      setTimeout(() => this.refreshFloodReports(), config.reports_refresh);

    });
  }

  // Refresh flood reports
  refreshFloodGauges() {
    // Start the spinner
    this.refreshing = true;

    this.api.getFloodgauges().then((data) => {
      // Refresh the reports map layer
      this.gaugeLayer.clearLayers();
      this.gaugeLayer.addData(data);

      // Stop the spinner
      this.refreshing = false;

      // Iterate
      setTimeout(() => this.refreshFloodGauges(), config.gauges_refresh);

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
    let layer = this.floodLayer.getLayer(this.floodDict[this.selectedArea.properties.area_id]._leaflet_id);
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
    let ok = confirm('Apakah Anda yakin ingin menghapus semua banjir?');
    if (!ok) return;

    // Filter out the flooded states
    let flooded = this.floods.features.filter((flood) => flood.properties.state);

    // Generate a delete request for each
    let promises = [];

    flooded.map((flood) => {
      promises.push(this.api.deleteFloodState(flood.properties.area_id, this.profile ? this.profile.email : 'rem'));
    });

    // When all flood states have been cleared
    Promise.all(promises).then(() => {
      // Refresh the flood states
      this.refreshFloodStates();
    }).catch((err) => {
      this.error = err.message;
      this.refreshing = false;
    });
  }
}
