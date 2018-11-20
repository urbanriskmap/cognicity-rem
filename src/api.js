import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';

import * as topojson from 'topojson-client';

// Import environment variables
import env from './environment';

// URL for Cognicity Data API
const DATA_URL = env.dataUrl;

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
    // Authentication headers
    let auth = { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') } };
    return this.http.fetch(`${DATA_URL}/floods?city=` + env.mapConfig.region, auth)
    .then((response) => {
      if (response.status >= 400) reject(new Error('Unexpected error retrieving floods'));
      response.json().then((data) => resolve(convertTopoToGeo(data)));
    })
    .catch((err) => {
      reject(new Error('Error retrieving floods', err));
    });
  });

  // Get the latest flood states as json
  getFloodStates = () => new Promise((resolve, reject) => {
    // Authentication headers
    let auth = { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') } };
    return this.http.fetch(`${DATA_URL}/floods/states?city=` + env.mapConfig.region + `&minimum_state=1`, auth)
    .then((response) => {
      if (response.status >= 400) reject(new Error('Unexpected error retrieving flood states'));
      response.json().then((data) => resolve(data));
    })
    .catch((err) => {
      reject(new Error('Error retrieving flood states', err));
    });
  });

  // Get infrastructure as topojson, return geojson
  getInfrastructure = (type) => new Promise((resolve, reject) => {
    // Authentication headers
    let auth = { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') } };
    return this.http.fetch(`${DATA_URL}/infrastructure/${type}`, auth)
    .then((response) => {
      if (response.status >= 400) reject(new Error('Unexpected error retrieving infrastructure'));
      response.json().then((data) => resolve(convertTopoToGeo(data)));
    })
    .catch((err) => {
      reject(new Error('Error retrieving infrastructure', err));
    });
  });

  // Get floodgauge data as topojson, return geojson
  getFloodgauges = () => new Promise((resolve, reject) => {
    // Authentication headers
    let auth = { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') } };
    return this.http.fetch(`${DATA_URL}/floodgauges`, auth)
    .then((response) => {
      if (response.status >= 400) reject(new Error('Unexpected error retrieving infrastructure'));
      response.json().then((data) => resolve(convertTopoToGeo(data)));
    })
    .catch((err) => {
      reject(new Error('Error retrieving infrastructure', err));
    });
  });

  // Get floods as topojson, return geojson
  getReports = () => new Promise((resolve, reject) => {
    // Authentication headers
    let auth = { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') } };
    return this.http.fetch(`${DATA_URL}/reports?city=` + env.mapConfig.region, auth)
    .then((response) => {
      if (response.status >= 400) reject(new Error('Unexpected error retrieving flood reports'));
      response.json().then((data) => resolve(convertTopoToGeo(data)));
    })
    .catch((err) => {
      reject(new Error('Error retrieving flood reports', err));
    });
  });

  // Update the value of the flood state
  updateFloodState = (localAreaId, state, username) => new Promise((resolve, reject) => {
    // Authentication headers
    let auth = { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') } };
    return this.http.fetch(`${DATA_URL}/floods/${localAreaId}?username=${username}`,
      { ...auth, ...{ method: 'put', body: json({ state }) } })
    .then((response) => {
      if (response.status >= 400) reject(new Error('Unexpected error updating flood state'));
      response.json().then((data) => resolve(data));
    })
    .catch((err) => {
      reject(new Error('Error updating flood state', err));
    });
  });

  // Delete the value of the flood state
  deleteFloodState = (localAreaId, username) => new Promise((resolve, reject) => {
    console.log('delete called');
    // Authentication headers
    let auth = { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') } };
    return this.http.fetch(`${DATA_URL}/floods/${localAreaId}?username=${username}`,
      { ...auth, ...{ method: 'delete' } } )
    .then((response) => {
      console.log(response);
      if (response.status >= 400) reject(new Error('Unexpected error deleting flood state'));
      response.json().then((data) => resolve(data));
    })
    .catch((err) => {
      reject(new Error('Error deleting flood state', err));
    });
  });

}
