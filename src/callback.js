// src/callback.js
import { inject } from 'aurelia-framework';
import { handleAuthentication } from './utils';
import { Router } from 'aurelia-router';

@inject(Router)
export class Callback {
  constructor(router) {
    handleAuthentication(router);
  }
}
