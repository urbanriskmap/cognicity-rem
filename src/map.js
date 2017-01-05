import { Redirect } from 'aurelia-router';
import { tokenIsExpired } from './utils';

export class Map {
  constructor() {
    this.message = "I'm the Map";
  }

  canActivate() {
    if(tokenIsExpired()) {
      return new Redirect('');
    } else {
      return true;
    }
  }
}
