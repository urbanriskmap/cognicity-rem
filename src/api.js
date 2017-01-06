import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';

// TODO: Move to environment variable
// URL for Cognicity Data API
const DATA_URL = 'https://data.petabencana.id';

// Authentication headers
const auth = { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') } }

// Wrapper class for API calls to Cognicity Data API
@inject(HttpClient)
export class API {

  // Initialize requesting status
  isRequesting = false;

  // Build the class injecting the HTTP client
  constructor(http) {
    this.http = http;
    var self = this;
  }

  // TODO: Error handling
  // Get infrastructure
  getInfrastructure = (type) => {
    this.isRequesting = true;
    return this.http.fetch(`${DATA_URL}/infrastructure/${type}`, auth)
    .then((response) => {
      this.isRequesting = false;
      if (response.status >= 400) throw new Error('Error calling data server');
      else return response.json();
    })
    .catch((err) => {
      this.isRequesting = false;
      console.log('Error calling data server');
      throw new Error('Error calling data server', err);
    });
  }

}
