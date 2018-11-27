import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { API } from './api';
import { tokenIsExpired, getProfile, auth_login, auth_logout } from './utils';
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

  isAuthenticated = false;
  isEditor = false;
  username = null;
  loginToggled = false;
  landingMessage = 'Silakan login untuk mengakses peta';


  checkIfLoggedIn(){
    // If the token has expired log the user out
    if (tokenIsExpired()) {
      this.isAuthenticated = false;
      this.isEditor = false;
      this.username = null;
    } else {
      this.isAuthenticated = true;
      let profile = getProfile();
      if (profile) {
        this.isEditor = profile.app_metadata && profile.app_metadata.role === 'editor-srg';
        this.username = profile.email;
      }
    }
  }

  constructor(api, i18n, router) {
    this.api = api;
    this.i18n = i18n;
    this.router = router;
    let self = this;
    self.checkIfLoggedIn();
    document.addEventListener('auth-changed',function(){
      self.checkIfLoggedIn();
    });



  }

  configureRouter(config, router) {
    config.title = this.i18n.tr('title');
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      { route: '', moduleId: 'home', name: 'home', title: 'Home' },
      { route: 'map', moduleId: 'map', name: 'map', title: 'Map' },
      { route: 'callback', moduleId: 'callback', name: 'callback', title: 'Logging in' }

    ]);
    this.router = router;
  }

  login() {
     auth_login();
  }

  logout() {
    this.isAuthenticated = false;
    // Redirect to the home view
    auth_logout();
    this.router.navigate('');
  }
}
