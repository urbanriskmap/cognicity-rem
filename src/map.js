import { inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';

import * as L from 'leaflet';

import { API } from './api';
import { tokenIsExpired } from './utils';

const config = {
  region: 'jbd',
  bounds: {
    sw: [-6.733, 106.480],
    ne: [-5.880, 107.175]
  }
}

@inject(API, I18N)
export class Map {

  constructor(api, i18n) {
    this.api = api;
    this.i18n = i18n;
    var self = this;
    this.message = "I'm the Map";

    // Load the various types of infrastructure
    api.getInfrastructure('waterways')
    .then((data) => this.waterways = JSON.stringify(data))
    .catch((err) => this.error = err.message);
    api.getInfrastructure('pumps')
    .then((data) => this.pumps = JSON.stringify(data))
    .catch((err) => this.error = err.message);
    api.getInfrastructure('floodgates')
    .then((data) => this.floodgates = JSON.stringify(data))
    .catch((err) => this.error = err.message);
  }

  attached() {

    // Create map
    this.map = L.map('mapContainer', {
      attributionControl: false
    }).fitBounds([config.bounds.sw, config.bounds.ne]);

    // Add base map
    L.tileLayer(self.config.tile_layer, {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OSM</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
      detectRetina: true,
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 18,
      ext: 'png'
    }).addTo(this.map);

  }

  canActivate() {
    if(tokenIsExpired()) {
      return new Redirect('');
    } else {
      return true;
    }
  }

}
