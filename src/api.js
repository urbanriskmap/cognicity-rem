import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';

import * as topojson from 'topojson-client';

// TODO: Move to environment variable
// URL for Cognicity Data API
const DATA_URL = 'https://data.petabencana.id';

// Authentication headers
const auth = { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') } };

// Wrapper class for API calls to Cognicity Data API
@inject(HttpClient)
export class API {

  // Initialize requesting status
  isRequesting = false;

  // Build the class injecting the HTTP client
  constructor(http) {
    this.http = http;
  }

  // Get floods, return geojson
  getFloods = (type) => {
    this.isRequesting = true;
    return this.http.fetch(`${DATA_URL}/floods?city=jbd`, auth)
    .then((response) => {
      this.isRequesting = false;
      if (response.status >= 400) throw new Error('Error calling data server');
      else return response.json();
    })
    .catch((err) => {
      this.isRequesting = false;
      throw new Error('Error calling data server', err);
    });
  }

  // Get infrastructure as topojson, return geojson
  getInfrastructure = (type) => new Promise((resolve, reject) => {
    this.isRequesting = true;
    return this.http.fetch(`${DATA_URL}/infrastructure/${type}`, auth)
    .then((response) => {
      this.isRequesting = false;
      if (response.status >= 400) reject(new Error('Unexpected error calling data server'));
      response.json().then((data) => {
        //console.log(data);
        if (!data || !data.result || data.result.type != 'Topology')
          reject(new Error('Unexpected response from data server'));
        let geojson = topojson.feature(data.result, data.result.objects.output);
        //console.log(geojson);
        resolve(geojson);
      });
    })
    .catch((err) => {
      this.isRequesting = false;
      reject(err);
    });
  });

}
