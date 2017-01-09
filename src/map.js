import { inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';

import * as L from 'leaflet';
import * as topojson from 'topojson-client';

import { API } from './api';
import { tokenIsExpired } from './utils';

import users from './data';

const config = {
  region: 'jbd',
  bounds: {
    sw: [-6.733, 106.480],
    ne: [-5.880, 107.175]
  },
  tile_layer: 'https://api.mapbox.com/styles/v1/urbanriskmap/ciwwgpt9j004a2prwm9cylsrc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidXJiYW5yaXNrbWFwIiwiYSI6ImNpdmVhbTFraDAwNHIyeWw1ZDB6Y2hhbTYifQ.tpgt1PB5lkJ-wITS02c96Q',
  infrastructure: ['waterways', 'pumps', 'floodgates']
};

// Extend Leaflet to support TopoJSON
L.TopoJSON = L.GeoJSON.extend({
  addData: (topoJson) => {
    if (topoJson.type === 'Topology') {
      let geojson = topojson.feature(topoJson, topoJson.objects.output);
      L.GeoJSON.prototype.addData.call(this, geojson);
    }
    // TODO: Throw error if not Topology?
  }
});

@inject(API, I18N)
export class Map {

  constructor(api, i18n) {
    this.api = api;
    this.i18n = i18n;
    this.users = users;
    this.pageSize = 5;
  }

  attached() {
    // Create map
    this.map = L.map('mapContainer', {
      attributionControl: false
    }).fitBounds([config.bounds.sw, config.bounds.ne]);

    // Add base layer
    L.tileLayer(config.tile_layer, {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OSM</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
      detectRetina: true,
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 18,
      ext: 'png'
    }).addTo(this.map);

    // Setup out topo layer and add to the map
    let topoLayer = new L.TopoJSON();
    topoLayer.addTo(this.map);

    // Add infrastructure layers
    for (let type of config.infrastructure) {
      this.api.getInfrastructure(type)
        .then((data) => {
          //topoLayer.addData(data);
        })
        .catch((err) => this.error = err.message);
    }
  }

  canActivate() {
    if (tokenIsExpired()) return new Redirect('');
    return true;
  }

}
