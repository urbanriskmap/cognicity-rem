import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';

import { API } from './api';
import { tokenIsExpired } from './utils';

// TODO: Move into environment variables
// TODO: Check credentials and log an error if incorrect
const AUTH0_CLIENT_ID = 'ApdfZvV1BrxXmwdg6Djrle4m2nav5ub9';
const AUTH0_DOMAIN = 'petabencana.au.auth0.com';

// Check credentials are supplied otherwise throw error
if (!AUTH0_CLIENT_ID || !AUTH0_DOMAIN) throw new Error('Auth0 credentials are required');

@inject(API, I18N)
export class App {

  lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
  isAuthenticated = false;

  constructor(api, i18n) {
    this.api = api;
    this.i18n = i18n;
    let self = this;

    if (tokenIsExpired()) {
      this.isAuthenticated = false;
    } else {
      this.isAuthenticated = true;
    }

    this.lock.on('authenticated', (authResult) => {
      self.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          return;
        }

        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        self.isAuthenticated = true;
        self.lock.hide();
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
  }
}
