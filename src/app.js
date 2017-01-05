import { I18N } from 'aurelia-i18n';
import { HttpClient } from 'aurelia-fetch-client';
import { tokenIsExpired } from './utils';

// TODO: Move into environment variables
const AUTH0_CLIENT_ID = '';
const AUTH0_DOMAIN = '';

export class App {

  lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
  isAuthenticated = false;

  static inject = [I18N, HttpClient];

  constructor(i18n, http) {
    this.i18n = i18n;
    this.http = http;
    var self = this;

    if (tokenIsExpired()) {
      this.isAuthenticated = false;
    } else {
      this.isAuthenticated = true;
    }

    this.lock.on("authenticated", (authResult) => {
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

  configureRouter(config, router){
    config.title = this.i18n.tr('title');
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      { route: '', moduleId: 'home', title: 'Home' },
      { route: 'map', moduleId: 'map', title: 'Map', name: 'Map' }
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
