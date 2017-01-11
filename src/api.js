import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';

import * as topojson from 'topojson-client';

// Import environment variables
import env from './environment';

// URL for Cognicity Data API
const DATA_URL = env.dataUrl;

// Authentication headers
const auth = { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') } };

// Convert topjson to geojson
const convertTopoToGeo = (data) => new Promise((resolve, reject) => {
  if (!data || !data.result || data.result.type != 'Topology')
    reject(new Error('Unexpected response from data server'));
  let geojson = topojson.feature(data.result, data.result.objects.output);
  resolve(geojson);
});

// Wrapper class for API calls to Cognicity Data API
@inject(HttpClient)
export class API {

  // Initialize requesting status
  isRequesting = false;

  // Build the class injecting the HTTP client
  constructor(http) {
    this.http = http;
  }

  // Get floods as topojson, return geojson
  getFloods = () => new Promise((resolve, reject) => {
    return this.http.fetch(`${DATA_URL}/floods?city=jbd`, auth)
    .then((response) => {
      if (response.status >= 400) reject(new Error('Unexpected error updating floods'));
      response.json().then((data) => resolve(convertTopoToGeo(data)));
    })
    .catch((err) => {
      reject(new Error('Error updating floods', err));
    });
  });

  // Get the latest flood states as json
  getFloodStates = () => new Promise((resolve, reject) => {
    return this.http.fetch(`${DATA_URL}/floods/states?city=jbd&minimum_state=1`, auth)
    .then((response) => {
      if (response.status >= 400) reject(new Error('Unexpected updating flood states'));
      response.json().then((data) => resolve(data));
    })
    .catch((err) => {
      reject(new Error('Error updating flood states', err));
    });
  });

  // Get infrastructure as topojson, return geojson
  getInfrastructure = (type) => new Promise((resolve, reject) => {
    return this.http.fetch(`${DATA_URL}/infrastructure/${type}`, auth)
    .then((response) => {
      if (response.status >= 400) reject(new Error('Unexpected updating infrastructure'));
      response.json().then((data) => resolve(convertTopoToGeo(data)));
    })
    .catch((err) => {
      reject(new Error('Error updating infrastructure', err));
    });
  });

  // Get floods as topojson, return geojson
  getReports = () => new Promise((resolve, reject) => {
    return this.http.fetch(`${DATA_URL}/reports?city=jbd`, auth)
    .then((response) => {
      if (response.status >= 400) reject(new Error('Unexpected updating flood reports'));
      response.json().then((data) => resolve(convertTopoToGeo(data)));
    })
    .catch((err) => {
      reject(new Error('Error updating flood reports', err));
    });
  });

}
