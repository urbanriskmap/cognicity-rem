import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { API } from './api';
import { tokenIsExpired, getProfile } from './utils';
import { Router } from 'aurelia-router';

// Import environment variables
import env from './environment';

// TODO: Check credentials and log an error if incorrect
const AUTH0_CLIENT_ID = env.AUTH0_CLIENT_ID;
const AUTH0_DOMAIN = env.AUTH0_DOMAIN;

// Check credentials are supplied otherwise throw error
if (!AUTH0_CLIENT_ID || !AUTH0_DOMAIN) throw new Error('Auth0 credentials are required');

@inject(API, I18N, Router)
export class App {

  // Setup the Lock, disabling the signup option
  lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    configurationBaseUrl: 'https://cdn.au.auth0.com',
    allowSignUp: false
  });
  isAuthenticated = false;
  isEditor = false;
  username = null;
  loginToggled = false;
  landingMessage = 'Silakan login untuk mengakses peta';

  constructor(api, i18n, router) {
    this.api = api;
    this.i18n = i18n;
    this.router = router;
    let self = this;

    // If the token has expired log the user out
    if (tokenIsExpired()) {
      this.isAuthenticated = false;
      this.isEditor = false;
      this.username = null;
    } else {
      this.isAuthenticated = true;
      let profile = getProfile();
      if (profile) {
        this.isEditor = profile.app_metadata && profile.app_metadata.role === 'editor';
        this.username = profile.email;
      }
    }

    // Once authenticated save the id_token and profile to local storage
    this.lock.on('authenticated', (authResult) => {
      self.landingMessage = 'loading...'
      self.lock.getProfile(authResult.accessToken, (error, profile) => {
        if (error) {
          // Handle error
          return;
        }
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        self.isEditor = profile.app_metadata && profile.app_metadata.role === 'editor';
        self.username = profile.email;
        self.isAuthenticated = true;
        self.lock.hide();
        // Redirect to the map view
        this.router.navigate('map');
        self.landingMessage = 'Silakan login untuk mengakses peta';
      });
    });
  }

  configureRouter(config, router) {
    config.title = this.i18n.tr('title');
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      { route: '', moduleId: 'home', name: 'home', title: 'Home' },
      { route: 'map', moduleId: 'map', name: 'map', title: 'Map' }
    ]);
    this.router = router;
  }

  login() {
    this.lock.show();
  }

  logout() {
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');
    this.isAuthenticated = false;
    // Redirect to the home view
    this.router.navigate('');
  }
}
