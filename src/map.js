import { inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';

import * as L from 'leaflet';
import * as erd from 'element-resize-detector';

import { API } from './api';
import { tokenIsExpired } from './utils';

import floods from './data';

const config = {
  region: 'jbd',
  bounds: {
    sw: [-6.733, 106.480],
    ne: [-5.880, 107.175]
  },
  tile_layer: 'https://api.mapbox.com/styles/v1/urbanriskmap/ciwwgpt9j004a2prwm9cylsrc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidXJiYW5yaXNrbWFwIiwiYSI6ImNpdmVhbTFraDAwNHIyeWw1ZDB6Y2hhbTYifQ.tpgt1PB5lkJ-wITS02c96Q',
  infrastructure: [ { type: 'waterways', default: false }, { type: 'pumps', default: false }, { type: 'floodgates', default: true } ]
};

@inject(API, I18N)
export class Map {

  constructor(api, i18n) {
    this.api = api;
    this.i18n = i18n;
    this.pageSize = 5;
    // TODO: Improve this, it is a little hacky and does not take into account user reszing their browser
    this.mapHeight = ( window.innerHeight * 0.65 ) - 50;
    this.tableHeight = ( window.innerHeight * 0.35 ) - 50;
  }

  attached() {

    // Create map
    this.map = L.map('mapContainer', {
      attributionControl: false
    }).fitBounds([config.bounds.sw, config.bounds.ne]);

    // Add base layer
    let mapboxLayer = L.tileLayer(config.tile_layer, {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OSM</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
      detectRetina: true,
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 18,
      ext: 'png'
    }).addTo(this.map);

    // Keep track of all of our layer promises
    let layerPromises = [];

    // Get latest flood information
    // TODO: Move to refresh method
    this.api.getFloods()
      .then((data) => {
        this.floods = data.result;

        // Add floods layer
        //this.floodLayer = new L.GeoJSON(this.floods);
        //this.floodLayer.addTo(this.map);

        // Populate floods table
        this.populateFloodAreas(this.floods);

      })
      .catch((err) => this.error = err.message);

    // Add infrastructure layers
    let infrastructureLayers = {};
    for (let infrastructure of config.infrastructure) {
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
          infrastructureLayers[infrastructure.type] = layer;
          if (infrastructure.default) layer.addTo(this.map);
        })
        .catch((err) => this.error = err.message));
    }

    // Add layers control once all layer promises have been resolved
    Promise.all(layerPromises).then(() => {
        L.control.layers(null, infrastructureLayers, {
          position: 'bottomleft',
          collapsed: false
        }).addTo(this.map);
    })
  }

  canActivate() {
    // Check if token is expired and redirect if so
    if (tokenIsExpired()) return new Redirect('/');
    return true;
  }

  populateFloodAreas(floods) {
    let self = this;
    let floodsObj = {};
    for (let flood of self.floods.objects.output.geometries) {
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

}
