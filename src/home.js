import {inject} from 'aurelia-framework';
import {App} from './app';

@inject(App)

export class Home {
  constructor(app) {
    this.message = 'Welcome Home';
    this.app = app;
  }
}
