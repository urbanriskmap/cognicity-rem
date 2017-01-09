define('api',['exports', 'aurelia-framework', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.API = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var DATA_URL = 'https://data.petabencana.id';

  var auth = { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') } };

  var API = exports.API = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function API(http) {
    var _this = this;

    _classCallCheck(this, API);

    this.isRequesting = false;

    this.getInfrastructure = function (type) {
      _this.isRequesting = true;
      return _this.http.fetch(DATA_URL + '/infrastructure/' + type, auth).then(function (response) {
        _this.isRequesting = false;
        if (response.status >= 400) throw new Error('Error calling data server');else return response.json();
      }).catch(function (err) {
        _this.isRequesting = false;
        throw new Error('Error calling data server', err);
      });
    };

    this.http = http;
  }) || _class);
});
define('app',['exports', 'aurelia-framework', 'aurelia-i18n', './api', './utils'], function (exports, _aureliaFramework, _aureliaI18n, _api, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AUTH0_CLIENT_ID = 'ApdfZvV1BrxXmwdg6Djrle4m2nav5ub9';
  var AUTH0_DOMAIN = 'petabencana.au.auth0.com';

  if (!AUTH0_CLIENT_ID || !AUTH0_DOMAIN) throw new Error('Auth0 credentials are required');

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_api.API, _aureliaI18n.I18N), _dec(_class = function () {
    function App(api, i18n) {
      _classCallCheck(this, App);

      this.lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
      this.isAuthenticated = false;

      this.api = api;
      this.i18n = i18n;
      var self = this;

      if ((0, _utils.tokenIsExpired)()) {
        this.isAuthenticated = false;
      } else {
        this.isAuthenticated = true;
      }

      this.lock.on('authenticated', function (authResult) {
        self.lock.getProfile(authResult.idToken, function (error, profile) {
          if (error) {
            return;
          }

          localStorage.setItem('id_token', authResult.idToken);
          localStorage.setItem('profile', JSON.stringify(profile));
          self.isAuthenticated = true;
          self.lock.hide();
        });
      });
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = this.i18n.tr('title');
      config.options.pushState = true;
      config.options.root = '/';
      config.map([{ route: '', moduleId: 'home', name: 'home', title: 'Home' }, { route: 'map', moduleId: 'map', name: 'map', title: 'Map' }]);

      this.router = router;
    };

    App.prototype.login = function login() {
      this.lock.show();
    };

    App.prototype.logout = function logout() {
      localStorage.removeItem('profile');
      localStorage.removeItem('id_token');
      this.isAuthenticated = false;
    };

    return App;
  }()) || _class);
});
define('data',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = [{
    '_id': '57ef9cd8e22df324d77c4f07',
    'index': 0,
    'guid': '9bc8e89d-658c-47cf-acc3-b0e225ddb549',
    'isActive': false,
    'balance': '$1,029.59',
    'picture': 'http://placehold.it/32x32',
    'age': 25,
    'eyeColor': 'green',
    'name': 'Deana Lindsay',
    'gender': 'female',
    'company': 'TERRAGO',
    'email': 'deanalindsay@terrago.com',
    'phone': '+1 (858) 506-2166',
    'address': {
      'street': '268 Garnet Street',
      'city': 'Chicopee',
      'state': 'Pennsylvania'
    },
    'registered': '2015-10-30',
    'tags': ['reprehenderit', 'duis', 'mollit', 'eiusmod', 'incididunt', 'nisi', 'sunt']
  }, {
    '_id': '57ef9cd8392af802937a0974',
    'index': 1,
    'guid': '1436aae5-4540-474a-8bad-4ca6b9c903ac',
    'isActive': true,
    'balance': '$1,302.22',
    'picture': 'http://placehold.it/32x32',
    'age': 39,
    'eyeColor': 'blue',
    'name': 'Wyatt Kline',
    'gender': 'male',
    'company': 'MEDMEX',
    'email': 'wyattkline@medmex.com',
    'phone': '+1 (827) 579-2502',
    'address': {
      'street': '234 Irwin Street',
      'city': 'Irwin',
      'state': 'Maine'
    },
    'registered': '2014-06-17',
    'tags': ['aute', 'laboris', 'sit', 'voluptate', 'magna', 'voluptate', 'occaecat']
  }, {
    '_id': '57ef9cd865c7f5203dc5e126',
    'index': 2,
    'guid': '2bc5aad6-2172-4041-a949-b31729290f25',
    'isActive': true,
    'balance': '$3,066.01',
    'picture': 'http://placehold.it/32x32',
    'age': 29,
    'eyeColor': 'green',
    'name': 'Harmon Huber',
    'gender': 'male',
    'company': 'SNIPS',
    'email': 'harmonhuber@snips.com',
    'phone': '+1 (931) 482-3018',
    'address': {
      'street': '913 Gerritsen Avenue',
      'city': 'Nash',
      'state': 'American Samoa'
    },
    'registered': '2016-01-25',
    'tags': ['do', 'voluptate', 'id', 'do', 'occaecat', 'minim', 'tempor']
  }, {
    '_id': '57ef9cd8594cc4bc18a121f7',
    'index': 3,
    'guid': '5d48aae2-9e3c-434e-a835-3abdab56e240',
    'isActive': false,
    'balance': '$3,574.33',
    'picture': 'http://placehold.it/32x32',
    'age': 29,
    'eyeColor': 'green',
    'name': 'Penny Maddox',
    'gender': 'female',
    'company': 'BALUBA',
    'email': 'pennymaddox@baluba.com',
    'phone': '+1 (873) 552-2338',
    'address': {
      'street': '218 Agate Court',
      'city': 'Sandston',
      'state': 'Oregon'
    },
    'registered': '2016-01-08',
    'tags': ['anim', 'aliqua', 'consequat', 'tempor', 'excepteur', 'est', 'enim']
  }, {
    '_id': '57ef9cd846b7cd74053c10c9',
    'index': 4,
    'guid': '3c4a0399-68c9-4741-8c77-0e7e0dd9ed00',
    'isActive': true,
    'balance': '$1,363.39',
    'picture': 'http://placehold.it/32x32',
    'age': 39,
    'eyeColor': 'brown',
    'name': 'Morgan Gomez',
    'gender': 'male',
    'company': 'AFFLUEX',
    'email': 'morgangomez@affluex.com',
    'phone': '+1 (976) 466-3779',
    'address': {
      'street': '632 Highland Avenue',
      'city': 'Tuttle',
      'state': 'Connecticut'
    },
    'registered': '2014-04-10',
    'tags': ['duis', 'deserunt', 'id', 'nostrud', 'mollit', 'consequat', 'ea']
  }, {
    '_id': '57ef9cd8d429bf34a0c2dc36',
    'index': 5,
    'guid': 'd321b26f-f8ce-461e-9673-5b9497aacea7',
    'isActive': false,
    'balance': '$1,469.54',
    'picture': 'http://placehold.it/32x32',
    'age': 35,
    'eyeColor': 'green',
    'name': 'Beck Mckay',
    'gender': 'male',
    'company': 'GEOLOGIX',
    'email': 'beckmckay@geologix.com',
    'phone': '+1 (879) 477-3341',
    'address': {
      'street': '936 Woodpoint Road',
      'city': 'Wakulla',
      'state': 'Mississippi'
    },
    'registered': '2016-05-06',
    'tags': ['non', 'cillum', 'culpa', 'irure', 'nulla', 'non', 'occaecat']
  }, {
    '_id': '57ef9cd86866468dc1c20447',
    'index': 6,
    'guid': 'c097a185-98ee-4bdd-a6ec-a3e5e40801be',
    'isActive': true,
    'balance': '$3,125.22',
    'picture': 'http://placehold.it/32x32',
    'age': 39,
    'eyeColor': 'blue',
    'name': 'Massey Carlson',
    'gender': 'male',
    'company': 'EARTHWAX',
    'email': 'masseycarlson@earthwax.com',
    'phone': '+1 (871) 471-2647',
    'address': {
      'street': '278 Chapel Street',
      'city': 'Taycheedah',
      'state': 'Hawaii'
    },
    'registered': '2014-10-22',
    'tags': ['ullamco', 'fugiat', 'consequat', 'nostrud', 'aliqua', 'consequat', 'fugiat']
  }, {
    '_id': '57ef9cd83f55c1d078fc6cfd',
    'index': 7,
    'guid': '29e53cbb-6353-44a3-a2c8-e7b3176d00af',
    'isActive': false,
    'balance': '$3,663.46',
    'picture': 'http://placehold.it/32x32',
    'age': 33,
    'eyeColor': 'blue',
    'name': 'Hill Hale',
    'gender': 'male',
    'company': 'CALCU',
    'email': 'hillhale@calcu.com',
    'phone': '+1 (877) 598-2610',
    'address': {
      'street': '618 Newport Street',
      'city': 'Deercroft',
      'state': 'Colorado'
    },
    'registered': '2016-04-18',
    'tags': ['nostrud', 'duis', 'Lorem', 'ex', 'elit', 'labore', 'in']
  }, {
    '_id': '57ef9cd8f8863a277e1c2055',
    'index': 8,
    'guid': '955a6cd5-b73c-4a6c-9280-76cbc4e232b2',
    'isActive': false,
    'balance': '$2,451.20',
    'picture': 'http://placehold.it/32x32',
    'age': 26,
    'eyeColor': 'blue',
    'name': 'Stokes Hurst',
    'gender': 'male',
    'company': 'DATAGEN',
    'email': 'stokeshurst@datagen.com',
    'phone': '+1 (897) 537-2718',
    'address': {
      'street': '146 Conover Street',
      'city': 'Dahlen',
      'state': 'North Dakota'
    },
    'registered': '2016-01-30',
    'tags': ['est', 'eu', 'anim', 'eiusmod', 'exercitation', 'commodo', 'nulla']
  }, {
    '_id': '57ef9cd86b62971bb96f7603',
    'index': 9,
    'guid': '239a3301-1dae-4ef8-ae30-7e92a84c78a2',
    'isActive': false,
    'balance': '$1,753.67',
    'picture': 'http://placehold.it/32x32',
    'age': 20,
    'eyeColor': 'green',
    'name': 'Cain Knapp',
    'gender': 'male',
    'company': 'NAMEBOX',
    'email': 'cainknapp@namebox.com',
    'phone': '+1 (873) 435-3377',
    'address': {
      'street': '460 Bridgewater Street',
      'city': 'Manchester',
      'state': 'Michigan'
    },
    'registered': '2016-01-04',
    'tags': ['fugiat', 'non', 'adipisicing', 'id', 'incididunt', 'do', 'enim']
  }, {
    '_id': '57ef9cd8431bccda13eea218',
    'index': 10,
    'guid': 'b5671cc8-2776-4180-9cab-2f26fd38c720',
    'isActive': false,
    'balance': '$1,619.16',
    'picture': 'http://placehold.it/32x32',
    'age': 22,
    'eyeColor': 'brown',
    'name': 'Ramirez Valdez',
    'gender': 'male',
    'company': 'SOLAREN',
    'email': 'ramirezvaldez@solaren.com',
    'phone': '+1 (820) 465-2360',
    'address': {
      'street': '932 Battery Avenue',
      'city': 'Iola',
      'state': 'Virginia'
    },
    'registered': '2014-01-27',
    'tags': ['minim', 'aliqua', 'culpa', 'dolore', 'excepteur', 'minim', 'sit']
  }, {
    '_id': '57ef9cd8e7379045d04a0540',
    'index': 11,
    'guid': '19b39b01-74e1-495c-b7a6-a88d66420fba',
    'isActive': false,
    'balance': '$1,638.78',
    'picture': 'http://placehold.it/32x32',
    'age': 39,
    'eyeColor': 'brown',
    'name': 'Alisha Michael',
    'gender': 'female',
    'company': 'STUCCO',
    'email': 'alishamichael@stucco.com',
    'phone': '+1 (800) 497-2778',
    'address': {
      'street': '184 Coffey Street',
      'city': 'Trucksville',
      'state': 'New York'
    },
    'registered': '2015-03-31',
    'tags': ['irure', 'dolore', 'minim', 'excepteur', 'aliquip', 'officia', 'fugiat']
  }, {
    '_id': '57ef9cd8059fd44b460b7c38',
    'index': 12,
    'guid': '2a3054d0-a2ea-4ee2-a2f5-f5d1d0573b11',
    'isActive': true,
    'balance': '$1,156.43',
    'picture': 'http://placehold.it/32x32',
    'age': 21,
    'eyeColor': 'brown',
    'name': 'Shepard Russo',
    'gender': 'male',
    'company': 'MAXIMIND',
    'email': 'shepardrusso@maximind.com',
    'phone': '+1 (810) 417-3060',
    'address': {
      'street': '450 Stryker Court',
      'city': 'Eagleville',
      'state': 'South Dakota'
    },
    'registered': '2014-12-17',
    'tags': ['qui', 'irure', 'pariatur', 'eiusmod', 'tempor', 'ullamco', 'aliquip']
  }, {
    '_id': '57ef9cd8afc877c47ac02b6a',
    'index': 13,
    'guid': '7ad0c0a8-59ca-457f-9b41-fd1ae83b4f60',
    'isActive': false,
    'balance': '$2,376.34',
    'picture': 'http://placehold.it/32x32',
    'age': 39,
    'eyeColor': 'blue',
    'name': 'Joyner Cohen',
    'gender': 'male',
    'company': 'LYRIA',
    'email': 'joynercohen@lyria.com',
    'phone': '+1 (962) 595-2903',
    'address': {
      'street': '304 Calder Place',
      'city': 'Choctaw',
      'state': 'Louisiana'
    },
    'registered': '2016-04-30',
    'tags': ['in', 'sunt', 'cupidatat', 'nostrud', 'laboris', 'culpa', 'consequat']
  }, {
    '_id': '57ef9cd8aa516857d091b670',
    'index': 14,
    'guid': '47be1205-5fde-4a1b-ba80-5ab56e659c32',
    'isActive': false,
    'balance': '$1,837.95',
    'picture': 'http://placehold.it/32x32',
    'age': 32,
    'eyeColor': 'blue',
    'name': 'Doreen Vincent',
    'gender': 'female',
    'company': 'VANTAGE',
    'email': 'doreenvincent@vantage.com',
    'phone': '+1 (972) 484-2153',
    'address': {
      'street': '520 Greenpoint Avenue',
      'city': 'Chapin',
      'state': 'Rhode Island'
    },
    'registered': '2015-12-11',
    'tags': ['cillum', 'aute', 'Lorem', 'occaecat', 'eu', 'voluptate', 'ea']
  }, {
    '_id': '57ef9cd8778023bd5ebc71df',
    'index': 15,
    'guid': '3efedc36-6bcd-4f78-b64e-11f6c3374ff0',
    'isActive': true,
    'balance': '$3,412.92',
    'picture': 'http://placehold.it/32x32',
    'age': 34,
    'eyeColor': 'green',
    'name': 'Felicia Osborne',
    'gender': 'female',
    'company': 'XELEGYL',
    'email': 'feliciaosborne@xelegyl.com',
    'phone': '+1 (884) 448-3923',
    'address': {
      'street': '895 Luquer Street',
      'city': 'Bluffview',
      'state': 'Alabama'
    },
    'registered': '2015-04-11',
    'tags': ['elit', 'veniam', 'consectetur', 'sunt', 'ipsum', 'incididunt', 'adipisicing']
  }, {
    '_id': '57ef9cd862a19b82a2b57c2a',
    'index': 16,
    'guid': '2a08992f-b1ca-4a75-9b4c-df4ba052f3b2',
    'isActive': false,
    'balance': '$2,053.01',
    'picture': 'http://placehold.it/32x32',
    'age': 35,
    'eyeColor': 'green',
    'name': 'Dillon Schmidt',
    'gender': 'male',
    'company': 'KEEG',
    'email': 'dillonschmidt@keeg.com',
    'phone': '+1 (869) 554-3796',
    'address': {
      'street': '344 Sullivan Place',
      'city': 'Bawcomville',
      'state': 'Palau'
    },
    'registered': '2016-07-04',
    'tags': ['mollit', 'duis', 'pariatur', 'velit', 'Lorem', 'Lorem', 'anim']
  }, {
    '_id': '57ef9cd8b2b36698294cfb64',
    'index': 17,
    'guid': '9644a804-0216-49c7-8625-d15a3bfb31c5',
    'isActive': false,
    'balance': '$2,507.00',
    'picture': 'http://placehold.it/32x32',
    'age': 40,
    'eyeColor': 'blue',
    'name': 'Melody Miranda',
    'gender': 'female',
    'company': 'ENTHAZE',
    'email': 'melodymiranda@enthaze.com',
    'phone': '+1 (849) 464-3618',
    'address': {
      'street': '418 Whitney Avenue',
      'city': 'Sanders',
      'state': 'Indiana'
    },
    'registered': '2014-04-22',
    'tags': ['consequat', 'commodo', 'magna', 'aute', 'occaecat', 'ea', 'minim']
  }, {
    '_id': '57ef9cd8410de3de4768210a',
    'index': 18,
    'guid': '3859f0d4-cc87-4d6b-b101-e867b8e5c0cc',
    'isActive': false,
    'balance': '$2,737.68',
    'picture': 'http://placehold.it/32x32',
    'age': 36,
    'eyeColor': 'green',
    'name': 'Wilkerson Melendez',
    'gender': 'male',
    'company': 'TECHMANIA',
    'email': 'wilkersonmelendez@techmania.com',
    'phone': '+1 (952) 481-3063',
    'address': {
      'street': '818 Ocean Parkway',
      'city': 'Kerby',
      'state': 'Iowa'
    },
    'registered': '2014-11-14',
    'tags': ['sit', 'cupidatat', 'aliqua', 'in', 'officia', 'pariatur', 'ex']
  }, {
    '_id': '57ef9cd8bda3e38af810f58a',
    'index': 19,
    'guid': '90af70fd-1241-4d07-b3f0-727f7987a60c',
    'isActive': true,
    'balance': '$1,028.57',
    'picture': 'http://placehold.it/32x32',
    'age': 37,
    'eyeColor': 'blue',
    'name': 'Rivera Velazquez',
    'gender': 'male',
    'company': 'GLEAMINK',
    'email': 'riveravelazquez@gleamink.com',
    'phone': '+1 (973) 597-3283',
    'address': {
      'street': '330 Monaco Place',
      'city': 'Grahamtown',
      'state': 'Northern Mariana Islands'
    },
    'registered': '2016-01-10',
    'tags': ['excepteur', 'est', 'occaecat', 'nulla', 'nostrud', 'eu', 'ipsum']
  }, {
    '_id': '57ef9cd8351d9509288c8469',
    'index': 20,
    'guid': 'c9f0b7e4-f7ec-44b5-ba6b-d9991bb3404b',
    'isActive': true,
    'balance': '$2,456.41',
    'picture': 'http://placehold.it/32x32',
    'age': 35,
    'eyeColor': 'blue',
    'name': 'Reese Velez',
    'gender': 'male',
    'company': 'POLARIA',
    'email': 'reesevelez@polaria.com',
    'phone': '+1 (950) 549-3805',
    'address': {
      'street': '571 Wilson Avenue',
      'city': 'Hannasville',
      'state': 'Tennessee'
    },
    'registered': '2016-07-24',
    'tags': ['veniam', 'occaecat', 'irure', 'consequat', 'labore', 'laboris', 'Lorem']
  }, {
    '_id': '57ef9cd8014e14851bee0084',
    'index': 21,
    'guid': '6691378e-7cb9-4bff-ac93-a79fadfa49d1',
    'isActive': false,
    'balance': '$3,892.36',
    'picture': 'http://placehold.it/32x32',
    'age': 33,
    'eyeColor': 'blue',
    'name': 'Kayla Morgan',
    'gender': 'female',
    'company': 'VIDTO',
    'email': 'kaylamorgan@vidto.com',
    'phone': '+1 (976) 499-2436',
    'address': {
      'street': '188 Lancaster Avenue',
      'city': 'Bowden',
      'state': 'District Of Columbia'
    },
    'registered': '2015-12-16',
    'tags': ['minim', 'proident', 'sunt', 'nostrud', 'adipisicing', 'cupidatat', 'veniam']
  }, {
    '_id': '57ef9cd810b76a3d60fb0b9b',
    'index': 22,
    'guid': '26e927c7-63c5-4e82-bdc0-7832cb890156',
    'isActive': false,
    'balance': '$3,668.66',
    'picture': 'http://placehold.it/32x32',
    'age': 20,
    'eyeColor': 'brown',
    'name': 'Benson Snyder',
    'gender': 'male',
    'company': 'ZOSIS',
    'email': 'bensonsnyder@zosis.com',
    'phone': '+1 (923) 595-3264',
    'address': {
      'street': '294 Douglass Street',
      'city': 'Hiseville',
      'state': 'Marshall Islands'
    },
    'registered': '2016-07-02',
    'tags': ['sint', 'amet', 'cillum', 'exercitation', 'Lorem', 'amet', 'ad']
  }, {
    '_id': '57ef9cd8d6e3b40316003054',
    'index': 23,
    'guid': '248e3d33-6827-461b-a92e-408a4927d5dc',
    'isActive': true,
    'balance': '$2,253.39',
    'picture': 'http://placehold.it/32x32',
    'age': 32,
    'eyeColor': 'green',
    'name': 'Strickland Andrews',
    'gender': 'male',
    'company': 'COMBOT',
    'email': 'stricklandandrews@combot.com',
    'phone': '+1 (969) 560-2376',
    'address': {
      'street': '677 Albemarle Road',
      'city': 'Thornport',
      'state': 'Florida'
    },
    'registered': '2015-06-15',
    'tags': ['culpa', 'nulla', 'excepteur', 'incididunt', 'nulla', 'mollit', 'occaecat']
  }, {
    '_id': '57ef9cd8bbf66c3b7757b773',
    'index': 24,
    'guid': '303c36fd-14e0-49f7-b6de-01c6cf866313',
    'isActive': false,
    'balance': '$1,248.11',
    'picture': 'http://placehold.it/32x32',
    'age': 21,
    'eyeColor': 'blue',
    'name': 'Castro Hanson',
    'gender': 'male',
    'company': 'FURNITECH',
    'email': 'castrohanson@furnitech.com',
    'phone': '+1 (901) 512-2724',
    'address': {
      'street': '932 Herkimer Court',
      'city': 'Cavalero',
      'state': 'Texas'
    },
    'registered': '2014-12-07',
    'tags': ['est', 'aliqua', 'enim', 'ex', 'Lorem', 'nostrud', 'eiusmod']
  }, {
    '_id': '57ef9cd8aa22d92e5c82b2f6',
    'index': 25,
    'guid': 'fd997458-836f-4d24-bbab-a0aa26e68c2d',
    'isActive': false,
    'balance': '$1,264.43',
    'picture': 'http://placehold.it/32x32',
    'age': 21,
    'eyeColor': 'blue',
    'name': 'Iris Nielsen',
    'gender': 'female',
    'company': 'ROUGHIES',
    'email': 'irisnielsen@roughies.com',
    'phone': '+1 (916) 468-3250',
    'address': {
      'street': '824 Doscher Street',
      'city': 'Goodville',
      'state': 'South Carolina'
    },
    'registered': '2015-08-01',
    'tags': ['sint', 'voluptate', 'adipisicing', 'id', 'eiusmod', 'veniam', 'excepteur']
  }, {
    '_id': '57ef9cd8e00712c4924d6413',
    'index': 26,
    'guid': 'f6b3c048-e563-4fa6-a28f-d358c5b4f74c',
    'isActive': true,
    'balance': '$1,462.23',
    'picture': 'http://placehold.it/32x32',
    'age': 23,
    'eyeColor': 'blue',
    'name': 'Dionne Boyer',
    'gender': 'female',
    'company': 'PETIGEMS',
    'email': 'dionneboyer@petigems.com',
    'phone': '+1 (826) 510-3961',
    'address': {
      'street': '483 Prospect Avenue',
      'city': 'Forestburg',
      'state': 'Nevada'
    },
    'registered': '2016-09-09',
    'tags': ['ipsum', 'id', 'eiusmod', 'laboris', 'incididunt', 'deserunt', 'anim']
  }, {
    '_id': '57ef9cd8a25729d7ccb55e01',
    'index': 27,
    'guid': '376807be-1fdc-4d6a-961c-84b313b81f70',
    'isActive': true,
    'balance': '$1,384.08',
    'picture': 'http://placehold.it/32x32',
    'age': 33,
    'eyeColor': 'green',
    'name': 'Cooke Alford',
    'gender': 'male',
    'company': 'PROXSOFT',
    'email': 'cookealford@proxsoft.com',
    'phone': '+1 (850) 486-2468',
    'address': {
      'street': '870 High Street',
      'city': 'Reinerton',
      'state': 'Delaware'
    },
    'registered': '2016-03-25',
    'tags': ['id', 'amet', 'irure', 'eiusmod', 'excepteur', 'nostrud', 'qui']
  }, {
    '_id': '57ef9cd8998c6d6498836a72',
    'index': 28,
    'guid': 'fe5ad1f3-c898-4635-bbd8-6c3185e9415f',
    'isActive': false,
    'balance': '$1,658.18',
    'picture': 'http://placehold.it/32x32',
    'age': 24,
    'eyeColor': 'brown',
    'name': 'Goff Lamb',
    'gender': 'male',
    'company': 'GLOBOIL',
    'email': 'gofflamb@globoil.com',
    'phone': '+1 (996) 400-2491',
    'address': {
      'street': '361 Interborough Parkway',
      'city': 'Dodge',
      'state': 'Kansas'
    },
    'registered': '2016-09-12',
    'tags': ['nisi', 'cupidatat', 'aliquip', 'non', 'et', 'sint', 'enim']
  }, {
    '_id': '57ef9cd82e0778dff1ee3579',
    'index': 29,
    'guid': 'ea213edd-47dd-4fd5-be36-27e34fa7fba1',
    'isActive': false,
    'balance': '$2,355.96',
    'picture': 'http://placehold.it/32x32',
    'age': 21,
    'eyeColor': 'brown',
    'name': 'Barry Ramsey',
    'gender': 'male',
    'company': 'ACCUPHARM',
    'email': 'barryramsey@accupharm.com',
    'phone': '+1 (841) 406-3771',
    'address': {
      'street': '220 Henderson Walk',
      'city': 'Gerber',
      'state': 'California'
    },
    'registered': '2014-11-15',
    'tags': ['cillum', 'esse', 'aliqua', 'do', 'irure', 'eu', 'eu']
  }, {
    '_id': '57ef9cd8b7a3f7141cd6787a',
    'index': 30,
    'guid': '05148b5f-e9b2-4697-a25c-b9de7473f4bc',
    'isActive': true,
    'balance': '$1,262.77',
    'picture': 'http://placehold.it/32x32',
    'age': 31,
    'eyeColor': 'brown',
    'name': 'Aguilar Koch',
    'gender': 'male',
    'company': 'EMERGENT',
    'email': 'aguilarkoch@emergent.com',
    'phone': '+1 (829) 518-3177',
    'address': {
      'street': '929 Himrod Street',
      'city': 'Leeper',
      'state': 'New Jersey'
    },
    'registered': '2015-07-12',
    'tags': ['ipsum', 'eu', 'cillum', 'aute', 'labore', 'ea', 'eiusmod']
  }, {
    '_id': '57ef9cd83f6b95641c5e3c75',
    'index': 31,
    'guid': '27304437-1b44-4ad8-81e8-710b4b8345ff',
    'isActive': false,
    'balance': '$3,601.82',
    'picture': 'http://placehold.it/32x32',
    'age': 24,
    'eyeColor': 'brown',
    'name': 'Oconnor Hopper',
    'gender': 'male',
    'company': 'FUELWORKS',
    'email': 'oconnorhopper@fuelworks.com',
    'phone': '+1 (891) 493-3016',
    'address': {
      'street': '426 Montieth Street',
      'city': 'Hegins',
      'state': 'Wyoming'
    },
    'registered': '2015-07-24',
    'tags': ['minim', 'voluptate', 'elit', 'incididunt', 'ut', 'fugiat', 'occaecat']
  }, {
    '_id': '57ef9cd8369d6e4b835f3fcd',
    'index': 32,
    'guid': '721a77b7-b011-47f4-a810-e7f29e7006c9',
    'isActive': true,
    'balance': '$1,915.04',
    'picture': 'http://placehold.it/32x32',
    'age': 20,
    'eyeColor': 'green',
    'name': 'Daugherty White',
    'gender': 'male',
    'company': 'BOLAX',
    'email': 'daughertywhite@bolax.com',
    'phone': '+1 (826) 594-2129',
    'address': {
      'street': '449 Lester Court',
      'city': 'Joes',
      'state': 'Massachusetts'
    },
    'registered': '2014-10-13',
    'tags': ['Lorem', 'enim', 'nostrud', 'nisi', 'consequat', 'ullamco', 'laborum']
  }, {
    '_id': '57ef9cd86305c595658af48b',
    'index': 33,
    'guid': '1cfc8de2-d36c-4ef1-9e40-f088cf75eb82',
    'isActive': true,
    'balance': '$2,866.63',
    'picture': 'http://placehold.it/32x32',
    'age': 40,
    'eyeColor': 'blue',
    'name': 'Kane Mclaughlin',
    'gender': 'male',
    'company': 'BUZZNESS',
    'email': 'kanemclaughlin@buzzness.com',
    'phone': '+1 (832) 531-3366',
    'address': {
      'street': '661 Apollo Street',
      'city': 'Crayne',
      'state': 'Kentucky'
    },
    'registered': '2014-07-08',
    'tags': ['laboris', 'quis', 'enim', 'ea', 'cupidatat', 'nisi', 'ipsum']
  }, {
    '_id': '57ef9cd8306a49b3a4173669',
    'index': 34,
    'guid': '0bf330e0-c370-466d-9a5e-4506272fd132',
    'isActive': false,
    'balance': '$1,185.64',
    'picture': 'http://placehold.it/32x32',
    'age': 40,
    'eyeColor': 'brown',
    'name': 'Berry Moore',
    'gender': 'male',
    'company': 'MOBILDATA',
    'email': 'berrymoore@mobildata.com',
    'phone': '+1 (868) 455-2610',
    'address': {
      'street': '655 Eldert Street',
      'city': 'Camino',
      'state': 'Arizona'
    },
    'registered': '2015-10-08',
    'tags': ['labore', 'dolore', 'labore', 'proident', 'aute', 'amet', 'quis']
  }, {
    '_id': '57ef9cd80ae90356bd04b760',
    'index': 35,
    'guid': '2be39caa-9fcc-4616-a7b5-f72e3d3cbdaf',
    'isActive': true,
    'balance': '$1,185.60',
    'picture': 'http://placehold.it/32x32',
    'age': 26,
    'eyeColor': 'blue',
    'name': 'Gwendolyn Hunt',
    'gender': 'female',
    'company': 'DIGIAL',
    'email': 'gwendolynhunt@digial.com',
    'phone': '+1 (853) 562-3237',
    'address': {
      'street': '597 Hart Street',
      'city': 'Kenmar',
      'state': 'Maryland'
    },
    'registered': '2015-10-27',
    'tags': ['Lorem', 'officia', 'adipisicing', 'velit', 'tempor', 'eiusmod', 'labore']
  }, {
    '_id': '57ef9cd884359a9538967098',
    'index': 36,
    'guid': '63ab3d9c-8138-4f09-baf9-6d76c5ba573a',
    'isActive': true,
    'balance': '$2,469.48',
    'picture': 'http://placehold.it/32x32',
    'age': 23,
    'eyeColor': 'green',
    'name': 'Willie Garrett',
    'gender': 'female',
    'company': 'BALOOBA',
    'email': 'williegarrett@balooba.com',
    'phone': '+1 (843) 425-3145',
    'address': {
      'street': '456 Maple Avenue',
      'city': 'Hackneyville',
      'state': 'Illinois'
    },
    'registered': '2014-02-09',
    'tags': ['est', 'aliqua', 'in', 'excepteur', 'ut', 'eu', 'fugiat']
  }, {
    '_id': '57ef9cd8db282c5f4f1448d4',
    'index': 37,
    'guid': 'bc8ce4f1-6cc4-4925-9046-3a5e91f858bc',
    'isActive': true,
    'balance': '$1,067.32',
    'picture': 'http://placehold.it/32x32',
    'age': 29,
    'eyeColor': 'green',
    'name': 'Christina Good',
    'gender': 'female',
    'company': 'APPLIDECK',
    'email': 'christinagood@applideck.com',
    'phone': '+1 (851) 462-3278',
    'address': {
      'street': '650 Arlington Place',
      'city': 'Wheaton',
      'state': 'West Virginia'
    },
    'registered': '2015-01-28',
    'tags': ['cupidatat', 'ad', 'consequat', 'proident', 'ex', 'officia', 'adipisicing']
  }, {
    '_id': '57ef9cd88452ab36aa70f054',
    'index': 38,
    'guid': '4db3de26-08ae-40a0-9dc6-cd9aad7bdc25',
    'isActive': false,
    'balance': '$3,016.01',
    'picture': 'http://placehold.it/32x32',
    'age': 35,
    'eyeColor': 'brown',
    'name': 'Hooper Blair',
    'gender': 'male',
    'company': 'ANARCO',
    'email': 'hooperblair@anarco.com',
    'phone': '+1 (877) 468-2384',
    'address': {
      'street': '535 Bancroft Place',
      'city': 'National',
      'state': 'Alaska'
    },
    'registered': '2015-02-24',
    'tags': ['non', 'laboris', 'aliqua', 'velit', 'officia', 'aliqua', 'in']
  }, {
    '_id': '57ef9cd8fd30953315b376ce',
    'index': 39,
    'guid': '2537139a-70e6-438b-980f-a43ee251db50',
    'isActive': true,
    'balance': '$1,259.80',
    'picture': 'http://placehold.it/32x32',
    'age': 26,
    'eyeColor': 'brown',
    'name': 'Wilson Whitley',
    'gender': 'male',
    'company': 'BUNGA',
    'email': 'wilsonwhitley@bunga.com',
    'phone': '+1 (881) 545-2408',
    'address': {
      'street': '536 Delevan Street',
      'city': 'Clara',
      'state': 'Oklahoma'
    },
    'registered': '2015-05-15',
    'tags': ['sunt', 'officia', 'officia', 'est', 'Lorem', 'elit', 'exercitation']
  }, {
    '_id': '57ef9cd88d9237233ce5a603',
    'index': 40,
    'guid': '407cc2cb-7eb0-4614-97d8-85a2b0ca2c55',
    'isActive': false,
    'balance': '$1,954.73',
    'picture': 'http://placehold.it/32x32',
    'age': 28,
    'eyeColor': 'blue',
    'name': 'Hilda Osborn',
    'gender': 'female',
    'company': 'SLOGANAUT',
    'email': 'hildaosborn@sloganaut.com',
    'phone': '+1 (975) 466-3813',
    'address': {
      'street': '412 Tudor Terrace',
      'city': 'Brecon',
      'state': 'Federated States Of Micronesia'
    },
    'registered': '2016-06-23',
    'tags': ['anim', 'culpa', 'fugiat', 'minim', 'occaecat', 'sit', 'excepteur']
  }, {
    '_id': '57ef9cd839131d7d2e092514',
    'index': 41,
    'guid': '0eb0fb97-2de9-4815-a533-7ac084b94863',
    'isActive': false,
    'balance': '$2,347.37',
    'picture': 'http://placehold.it/32x32',
    'age': 29,
    'eyeColor': 'blue',
    'name': 'Denise Griffin',
    'gender': 'female',
    'company': 'ATOMICA',
    'email': 'denisegriffin@atomica.com',
    'phone': '+1 (858) 538-2320',
    'address': {
      'street': '415 Catherine Street',
      'city': 'Onton',
      'state': 'Vermont'
    },
    'registered': '2014-06-17',
    'tags': ['qui', 'sunt', 'commodo', 'tempor', 'exercitation', 'nisi', 'exercitation']
  }, {
    '_id': '57ef9cd89974d5066113c5eb',
    'index': 42,
    'guid': '03ba8cb5-6ad5-47f9-a0f1-28939ade5983',
    'isActive': true,
    'balance': '$3,867.30',
    'picture': 'http://placehold.it/32x32',
    'age': 26,
    'eyeColor': 'green',
    'name': 'Neal Castro',
    'gender': 'male',
    'company': 'OVATION',
    'email': 'nealcastro@ovation.com',
    'phone': '+1 (967) 436-2454',
    'address': {
      'street': '119 Harrison Avenue',
      'city': 'Volta',
      'state': 'Idaho'
    },
    'registered': '2014-06-22',
    'tags': ['Lorem', 'cupidatat', 'et', 'quis', 'voluptate', 'incididunt', 'dolore']
  }, {
    '_id': '57ef9cd88d860c6070fafef1',
    'index': 43,
    'guid': 'e14b2f74-0aaa-4218-940d-5f7fb2551151',
    'isActive': true,
    'balance': '$3,011.45',
    'picture': 'http://placehold.it/32x32',
    'age': 22,
    'eyeColor': 'blue',
    'name': 'Rich Montoya',
    'gender': 'male',
    'company': 'ORBAXTER',
    'email': 'richmontoya@orbaxter.com',
    'phone': '+1 (866) 530-3039',
    'address': {
      'street': '134 Blake Court',
      'city': 'Kaka',
      'state': 'Arkansas'
    },
    'registered': '2016-06-21',
    'tags': ['sunt', 'cillum', 'enim', 'occaecat', 'minim', 'reprehenderit', 'nulla']
  }, {
    '_id': '57ef9cd8e093c420b70f6787',
    'index': 44,
    'guid': '1cabe364-180d-4147-88c7-2154241c22f2',
    'isActive': false,
    'balance': '$2,413.74',
    'picture': 'http://placehold.it/32x32',
    'age': 37,
    'eyeColor': 'brown',
    'name': 'Galloway Wilcox',
    'gender': 'male',
    'company': 'KENEGY',
    'email': 'gallowaywilcox@kenegy.com',
    'phone': '+1 (806) 596-3339',
    'address': {
      'street': '131 Kay Court',
      'city': 'Bannock',
      'state': 'Ohio'
    },
    'registered': '2014-12-04',
    'tags': ['consequat', 'elit', 'in', 'mollit', 'nostrud', 'amet', 'irure']
  }, {
    '_id': '57ef9cd8a07f64e3585adaa4',
    'index': 45,
    'guid': '9a0ba82c-3a59-4b8c-a735-16f57c4e5b7b',
    'isActive': true,
    'balance': '$1,419.98',
    'picture': 'http://placehold.it/32x32',
    'age': 25,
    'eyeColor': 'green',
    'name': 'Estela Johnson',
    'gender': 'female',
    'company': 'LUNCHPOD',
    'email': 'estelajohnson@lunchpod.com',
    'phone': '+1 (857) 457-3968',
    'address': {
      'street': '909 Cheever Place',
      'city': 'Clarence',
      'state': 'Missouri'
    },
    'registered': '2015-06-19',
    'tags': ['sint', 'velit', 'ut', 'minim', 'ad', 'proident', 'labore']
  }, {
    '_id': '57ef9cd863d1b1a4acb74988',
    'index': 46,
    'guid': '8154d3fc-2b77-4107-ab34-42bb23f470e6',
    'isActive': false,
    'balance': '$2,049.10',
    'picture': 'http://placehold.it/32x32',
    'age': 27,
    'eyeColor': 'green',
    'name': 'Lorrie Huffman',
    'gender': 'female',
    'company': 'SPHERIX',
    'email': 'lorriehuffman@spherix.com',
    'phone': '+1 (855) 535-2317',
    'address': {
      'street': '221 Essex Street',
      'city': 'Tedrow',
      'state': 'Washington'
    },
    'registered': '2016-09-27',
    'tags': ['consequat', 'excepteur', 'ipsum', 'ipsum', 'esse', 'cillum', 'qui']
  }, {
    '_id': '57ef9cd8e0a6bad7cf9ec1dc',
    'index': 47,
    'guid': 'd44f213d-7164-4aba-b5e1-5e8646853e41',
    'isActive': true,
    'balance': '$1,958.21',
    'picture': 'http://placehold.it/32x32',
    'age': 37,
    'eyeColor': 'brown',
    'name': 'Celia Burnett',
    'gender': 'female',
    'company': 'ENORMO',
    'email': 'celiaburnett@enormo.com',
    'phone': '+1 (834) 438-2214',
    'address': {
      'street': '315 Louisiana Avenue',
      'city': 'Wauhillau',
      'state': 'New Hampshire'
    },
    'registered': '2014-02-21',
    'tags': ['officia', 'cupidatat', 'ullamco', 'velit', 'ad', 'ea', 'nostrud']
  }, {
    '_id': '57ef9cd8e0617ebaf2a76998',
    'index': 48,
    'guid': '9d09a10a-6b16-44c5-bd72-20ee3188432c',
    'isActive': false,
    'balance': '$3,027.42',
    'picture': 'http://placehold.it/32x32',
    'age': 31,
    'eyeColor': 'brown',
    'name': 'Delaney Hamilton',
    'gender': 'male',
    'company': 'ACCUSAGE',
    'email': 'delaneyhamilton@accusage.com',
    'phone': '+1 (862) 425-3630',
    'address': {
      'street': '407 Oceanview Avenue',
      'city': 'Waikele',
      'state': 'New Mexico'
    },
    'registered': '2014-07-06',
    'tags': ['aliquip', 'fugiat', 'cillum', 'id', 'excepteur', 'ad', 'non']
  }, {
    '_id': '57ef9cd831ecdff3ea6aba9e',
    'index': 49,
    'guid': 'f5212db5-dfe2-426e-a4e0-83331831bbe8',
    'isActive': false,
    'balance': '$2,970.07',
    'picture': 'http://placehold.it/32x32',
    'age': 39,
    'eyeColor': 'green',
    'name': 'Elma Baldwin',
    'gender': 'female',
    'company': 'XANIDE',
    'email': 'elmabaldwin@xanide.com',
    'phone': '+1 (991) 445-3729',
    'address': {
      'street': '817 Loring Avenue',
      'city': 'Jenkinsville',
      'state': 'Virgin Islands'
    },
    'registered': '2015-03-13',
    'tags': ['aute', 'nisi', 'laborum', 'incididunt', 'non', 'eiusmod', 'ad']
  }, {
    '_id': '57ef9cd86e789f3db59cc997',
    'index': 50,
    'guid': 'c24777cb-e9c6-451a-b70b-9ffeefb35ee0',
    'isActive': false,
    'balance': '$1,072.96',
    'picture': 'http://placehold.it/32x32',
    'age': 24,
    'eyeColor': 'green',
    'name': 'Roxie Butler',
    'gender': 'female',
    'company': 'ISOLOGICA',
    'email': 'roxiebutler@isologica.com',
    'phone': '+1 (919) 442-2920',
    'address': {
      'street': '512 Dewey Place',
      'city': 'Lacomb',
      'state': 'Montana'
    },
    'registered': '2015-05-26',
    'tags': ['qui', 'labore', 'non', 'quis', 'id', 'quis', 'anim']
  }, {
    '_id': '57ef9cd882f83000536be05a',
    'index': 51,
    'guid': '2798139e-b8ec-409e-aa87-613149059143',
    'isActive': false,
    'balance': '$3,771.00',
    'picture': 'http://placehold.it/32x32',
    'age': 38,
    'eyeColor': 'blue',
    'name': 'Margie Davenport',
    'gender': 'female',
    'company': 'MALATHION',
    'email': 'margiedavenport@malathion.com',
    'phone': '+1 (976) 567-3933',
    'address': {
      'street': '241 Lloyd Court',
      'city': 'Stockwell',
      'state': 'Puerto Rico'
    },
    'registered': '2016-04-05',
    'tags': ['et', 'reprehenderit', 'dolor', 'consequat', 'sit', 'qui', 'mollit']
  }, {
    '_id': '57ef9cd8199466c0f80eaef0',
    'index': 52,
    'guid': '0d8ea36b-df98-4b07-952a-4cbac7c92c64',
    'isActive': false,
    'balance': '$2,047.61',
    'picture': 'http://placehold.it/32x32',
    'age': 31,
    'eyeColor': 'brown',
    'name': 'Zelma Macias',
    'gender': 'female',
    'company': 'ECLIPSENT',
    'email': 'zelmamacias@eclipsent.com',
    'phone': '+1 (893) 522-3991',
    'address': {
      'street': '812 Morgan Avenue',
      'city': 'Moquino',
      'state': 'Minnesota'
    },
    'registered': '2014-03-14',
    'tags': ['quis', 'aliquip', 'occaecat', 'ut', 'duis', 'est', 'Lorem']
  }, {
    '_id': '57ef9cd8e332fa4683ed0ef2',
    'index': 53,
    'guid': '992c8935-6934-4b46-be34-bb81f596d0cc',
    'isActive': true,
    'balance': '$3,363.81',
    'picture': 'http://placehold.it/32x32',
    'age': 32,
    'eyeColor': 'blue',
    'name': 'Dominique Best',
    'gender': 'female',
    'company': 'SNOWPOKE',
    'email': 'dominiquebest@snowpoke.com',
    'phone': '+1 (941) 596-2718',
    'address': {
      'street': '851 Turnbull Avenue',
      'city': 'Ruffin',
      'state': 'Wisconsin'
    },
    'registered': '2016-03-04',
    'tags': ['magna', 'velit', 'Lorem', 'culpa', 'mollit', 'adipisicing', 'eu']
  }, {
    '_id': '57ef9cd8b65cc853f277c21a',
    'index': 54,
    'guid': '8f690f7b-cdc8-4c84-b928-44fe3e7bc4b4',
    'isActive': false,
    'balance': '$3,463.40',
    'picture': 'http://placehold.it/32x32',
    'age': 39,
    'eyeColor': 'blue',
    'name': 'Meyers Navarro',
    'gender': 'male',
    'company': 'VALREDA',
    'email': 'meyersnavarro@valreda.com',
    'phone': '+1 (969) 596-2487',
    'address': {
      'street': '692 Lake Street',
      'city': 'Marienthal',
      'state': 'Guam'
    },
    'registered': '2015-06-22',
    'tags': ['mollit', 'laboris', 'deserunt', 'sit', 'excepteur', 'ut', 'ut']
  }, {
    '_id': '57ef9cd88d03578a7c15a598',
    'index': 55,
    'guid': '46cd7eac-1353-4bd2-99cc-2a9b5264a966',
    'isActive': false,
    'balance': '$1,911.65',
    'picture': 'http://placehold.it/32x32',
    'age': 24,
    'eyeColor': 'green',
    'name': 'Holland Hess',
    'gender': 'male',
    'company': 'IDEALIS',
    'email': 'hollandhess@idealis.com',
    'phone': '+1 (867) 599-2608',
    'address': {
      'street': '934 Stoddard Place',
      'city': 'Frizzleburg',
      'state': 'Nebraska'
    },
    'registered': '2015-02-19',
    'tags': ['dolor', 'sint', 'ipsum', 'ex', 'et', 'aute', 'elit']
  }, {
    '_id': '57ef9cd8a1f6180aec4821e5',
    'index': 56,
    'guid': 'eb23120a-a47d-499d-a3a5-9a5cc0d40233',
    'isActive': true,
    'balance': '$3,547.64',
    'picture': 'http://placehold.it/32x32',
    'age': 25,
    'eyeColor': 'brown',
    'name': 'Mckay Fields',
    'gender': 'male',
    'company': 'SLAX',
    'email': 'mckayfields@slax.com',
    'phone': '+1 (802) 483-2694',
    'address': {
      'street': '595 Jerome Street',
      'city': 'Oneida',
      'state': 'Utah'
    },
    'registered': '2014-11-18',
    'tags': ['reprehenderit', 'pariatur', 'aliquip', 'ullamco', 'veniam', 'labore', 'velit']
  }, {
    '_id': '57ef9cd8c473ecd605a3b6ca',
    'index': 57,
    'guid': '84c4fe9c-6917-49ce-a7a4-71ba9a7cba69',
    'isActive': true,
    'balance': '$1,731.31',
    'picture': 'http://placehold.it/32x32',
    'age': 39,
    'eyeColor': 'blue',
    'name': 'Melanie Austin',
    'gender': 'female',
    'company': 'ANDRYX',
    'email': 'melanieaustin@andryx.com',
    'phone': '+1 (994) 412-2994',
    'address': {
      'street': '533 Saratoga Avenue',
      'city': 'Bangor',
      'state': 'Georgia'
    },
    'registered': '2014-03-09',
    'tags': ['mollit', 'minim', 'in', 'in', 'Lorem', 'magna', 'non']
  }, {
    '_id': '57ef9cd891a61ccfd176aeef',
    'index': 58,
    'guid': '80295d78-5ce6-4dfe-b945-50e2ce602b44',
    'isActive': true,
    'balance': '$2,992.55',
    'picture': 'http://placehold.it/32x32',
    'age': 25,
    'eyeColor': 'blue',
    'name': 'Peck Schneider',
    'gender': 'male',
    'company': 'COFINE',
    'email': 'peckschneider@cofine.com',
    'phone': '+1 (913) 428-3201',
    'address': {
      'street': '441 Harbor Lane',
      'city': 'Tolu',
      'state': 'Pennsylvania'
    },
    'registered': '2016-05-29',
    'tags': ['Lorem', 'voluptate', 'ipsum', 'dolore', 'aliquip', 'ad', 'consequat']
  }, {
    '_id': '57ef9cd8e58b17c583b460a7',
    'index': 59,
    'guid': '0b18fc0c-f18f-46e3-845a-cd7b15c55865',
    'isActive': false,
    'balance': '$1,502.40',
    'picture': 'http://placehold.it/32x32',
    'age': 23,
    'eyeColor': 'green',
    'name': 'Mcclain Rhodes',
    'gender': 'male',
    'company': 'RODEOCEAN',
    'email': 'mcclainrhodes@rodeocean.com',
    'phone': '+1 (842) 446-2464',
    'address': {
      'street': '374 Amersfort Place',
      'city': 'Romeville',
      'state': 'Maine'
    },
    'registered': '2014-03-19',
    'tags': ['dolor', 'eiusmod', 'ad', 'voluptate', 'ea', 'deserunt', 'et']
  }, {
    '_id': '57ef9cd8724c03c5ad8e4a8e',
    'index': 60,
    'guid': '326dce0c-4b47-499b-9489-36acd6dadff8',
    'isActive': true,
    'balance': '$1,747.38',
    'picture': 'http://placehold.it/32x32',
    'age': 25,
    'eyeColor': 'blue',
    'name': 'Cervantes Bright',
    'gender': 'male',
    'company': 'VALPREAL',
    'email': 'cervantesbright@valpreal.com',
    'phone': '+1 (873) 587-2025',
    'address': {
      'street': '132 Bliss Terrace',
      'city': 'Winesburg',
      'state': 'American Samoa'
    },
    'registered': '2016-03-18',
    'tags': ['magna', 'dolore', 'veniam', 'veniam', 'sint', 'quis', 'id']
  }, {
    '_id': '57ef9cd8b398ed2934e4a722',
    'index': 61,
    'guid': '4b744dd7-3c86-4bce-a3c8-9eb4359ceed5',
    'isActive': false,
    'balance': '$3,697.92',
    'picture': 'http://placehold.it/32x32',
    'age': 34,
    'eyeColor': 'blue',
    'name': 'Hardin Pittman',
    'gender': 'male',
    'company': 'SKINSERVE',
    'email': 'hardinpittman@skinserve.com',
    'phone': '+1 (887) 454-3837',
    'address': {
      'street': '617 Robert Street',
      'city': 'Stevens',
      'state': 'Oregon'
    },
    'registered': '2015-04-25',
    'tags': ['sit', 'anim', 'proident', 'minim', 'adipisicing', 'duis', 'cillum']
  }, {
    '_id': '57ef9cd89a9aa77a634b1a47',
    'index': 62,
    'guid': '971cfb58-9d8e-4a06-ab1c-c6bc120c1865',
    'isActive': false,
    'balance': '$1,121.41',
    'picture': 'http://placehold.it/32x32',
    'age': 35,
    'eyeColor': 'blue',
    'name': 'Anna Ortega',
    'gender': 'female',
    'company': 'PHUEL',
    'email': 'annaortega@phuel.com',
    'phone': '+1 (887) 422-3308',
    'address': {
      'street': '809 Vandervoort Place',
      'city': 'Gibsonia',
      'state': 'Connecticut'
    },
    'registered': '2016-06-11',
    'tags': ['veniam', 'commodo', 'incididunt', 'commodo', 'ut', 'irure', 'aliqua']
  }, {
    '_id': '57ef9cd8d4ea52c7b0fce734',
    'index': 63,
    'guid': '3e62c184-2c7d-4620-be08-4a10ac9f1bce',
    'isActive': true,
    'balance': '$3,080.98',
    'picture': 'http://placehold.it/32x32',
    'age': 37,
    'eyeColor': 'brown',
    'name': 'Juliana Rios',
    'gender': 'female',
    'company': 'FIREWAX',
    'email': 'julianarios@firewax.com',
    'phone': '+1 (978) 409-2654',
    'address': {
      'street': '893 Heyward Street',
      'city': 'Fedora',
      'state': 'Mississippi'
    },
    'registered': '2015-07-21',
    'tags': ['sit', 'sint', 'eu', 'quis', 'do', 'mollit', 'magna']
  }, {
    '_id': '57ef9cd8faa17dc8818830e9',
    'index': 64,
    'guid': 'd3de53e8-6012-43ea-8c6b-1546739f9455',
    'isActive': true,
    'balance': '$3,162.09',
    'picture': 'http://placehold.it/32x32',
    'age': 24,
    'eyeColor': 'green',
    'name': 'Allison Collier',
    'gender': 'male',
    'company': 'ISOLOGICS',
    'email': 'allisoncollier@isologics.com',
    'phone': '+1 (961) 458-2654',
    'address': {
      'street': '987 Story Street',
      'city': 'Fairview',
      'state': 'Hawaii'
    },
    'registered': '2014-04-11',
    'tags': ['nulla', 'labore', 'anim', 'tempor', 'enim', 'aliqua', 'culpa']
  }, {
    '_id': '57ef9cd8414f04a3dafce7ef',
    'index': 65,
    'guid': 'd45fc8d9-2f09-42cf-918c-5d9c9b9049fb',
    'isActive': false,
    'balance': '$2,228.33',
    'picture': 'http://placehold.it/32x32',
    'age': 33,
    'eyeColor': 'brown',
    'name': 'Laurel Raymond',
    'gender': 'female',
    'company': 'FREAKIN',
    'email': 'laurelraymond@freakin.com',
    'phone': '+1 (845) 411-2269',
    'address': {
      'street': '270 Alice Court',
      'city': 'Bynum',
      'state': 'Colorado'
    },
    'registered': '2014-09-18',
    'tags': ['sit', 'dolore', 'eiusmod', 'dolor', 'aliquip', 'est', 'reprehenderit']
  }, {
    '_id': '57ef9cd8e744f8d49ef6d406',
    'index': 66,
    'guid': '8fd91938-f5a5-409d-8a97-bf4e683d76a1',
    'isActive': true,
    'balance': '$3,892.91',
    'picture': 'http://placehold.it/32x32',
    'age': 38,
    'eyeColor': 'brown',
    'name': 'Althea Horn',
    'gender': 'female',
    'company': 'FILODYNE',
    'email': 'altheahorn@filodyne.com',
    'phone': '+1 (950) 526-2536',
    'address': {
      'street': '666 Taylor Street',
      'city': 'Driftwood',
      'state': 'North Dakota'
    },
    'registered': '2016-01-13',
    'tags': ['cillum', 'fugiat', 'incididunt', 'sunt', 'proident', 'et', 'amet']
  }, {
    '_id': '57ef9cd80d3bd026a5b14c3d',
    'index': 67,
    'guid': '4a617fa7-dc5a-440a-ab0b-13f6e6ad34fe',
    'isActive': false,
    'balance': '$1,371.59',
    'picture': 'http://placehold.it/32x32',
    'age': 22,
    'eyeColor': 'blue',
    'name': 'Potter Cannon',
    'gender': 'male',
    'company': 'MONDICIL',
    'email': 'pottercannon@mondicil.com',
    'phone': '+1 (913) 431-3765',
    'address': {
      'street': '762 Drew Street',
      'city': 'Riceville',
      'state': 'Michigan'
    },
    'registered': '2015-08-31',
    'tags': ['velit', 'velit', 'ex', 'aliqua', 'consequat', 'esse', 'irure']
  }, {
    '_id': '57ef9cd8218b984cbcc2fcee',
    'index': 68,
    'guid': 'ebe26092-53b1-4fd9-b48f-37f68a7008b9',
    'isActive': true,
    'balance': '$2,799.55',
    'picture': 'http://placehold.it/32x32',
    'age': 23,
    'eyeColor': 'brown',
    'name': 'Alyson Calhoun',
    'gender': 'female',
    'company': 'ZEPITOPE',
    'email': 'alysoncalhoun@zepitope.com',
    'phone': '+1 (820) 510-3098',
    'address': {
      'street': '804 Rodney Street',
      'city': 'Hatteras',
      'state': 'Virginia'
    },
    'registered': '2014-09-25',
    'tags': ['occaecat', 'officia', 'enim', 'eu', 'ullamco', 'eu', 'pariatur']
  }, {
    '_id': '57ef9cd88e11ec366ca17611',
    'index': 69,
    'guid': '2bb46e78-c42a-449c-93b2-204091ec8296',
    'isActive': false,
    'balance': '$3,754.62',
    'picture': 'http://placehold.it/32x32',
    'age': 27,
    'eyeColor': 'brown',
    'name': 'Zimmerman Hudson',
    'gender': 'male',
    'company': 'OVERPLEX',
    'email': 'zimmermanhudson@overplex.com',
    'phone': '+1 (810) 589-3217',
    'address': {
      'street': '710 Lombardy Street',
      'city': 'Tampico',
      'state': 'New York'
    },
    'registered': '2015-12-05',
    'tags': ['aute', 'Lorem', 'magna', 'ut', 'esse', 'tempor', 'voluptate']
  }, {
    '_id': '57ef9cd8c663c704beb3ba0f',
    'index': 70,
    'guid': '3fe808f0-0757-4862-93e1-033724b2d61e',
    'isActive': false,
    'balance': '$3,403.56',
    'picture': 'http://placehold.it/32x32',
    'age': 38,
    'eyeColor': 'green',
    'name': 'Sharon Vargas',
    'gender': 'female',
    'company': 'SYNKGEN',
    'email': 'sharonvargas@synkgen.com',
    'phone': '+1 (837) 452-3719',
    'address': {
      'street': '451 Eckford Street',
      'city': 'Wyano',
      'state': 'South Dakota'
    },
    'registered': '2015-11-19',
    'tags': ['consectetur', 'sint', 'ad', 'sunt', 'ea', 'velit', 'officia']
  }, {
    '_id': '57ef9cd8c23f68e4099957d1',
    'index': 71,
    'guid': '79f80e61-d92e-4b97-bea7-0016fb3fbcdc',
    'isActive': false,
    'balance': '$1,738.35',
    'picture': 'http://placehold.it/32x32',
    'age': 22,
    'eyeColor': 'blue',
    'name': 'Herman House',
    'gender': 'male',
    'company': 'FRENEX',
    'email': 'hermanhouse@frenex.com',
    'phone': '+1 (928) 579-3978',
    'address': {
      'street': '770 Wyckoff Avenue',
      'city': 'Trail',
      'state': 'Louisiana'
    },
    'registered': '2015-03-20',
    'tags': ['elit', 'voluptate', 'sint', 'laboris', 'et', 'nisi', 'ad']
  }, {
    '_id': '57ef9cd8f684a162c8263ed1',
    'index': 72,
    'guid': '3a82a0ae-ffaa-4833-a4c1-1947eaf2a22a',
    'isActive': false,
    'balance': '$3,451.10',
    'picture': 'http://placehold.it/32x32',
    'age': 30,
    'eyeColor': 'green',
    'name': 'Lenore Hahn',
    'gender': 'female',
    'company': 'EXOSIS',
    'email': 'lenorehahn@exosis.com',
    'phone': '+1 (917) 524-3275',
    'address': {
      'street': '838 Gold Street',
      'city': 'Watchtower',
      'state': 'Rhode Island'
    },
    'registered': '2015-05-28',
    'tags': ['id', 'proident', 'velit', 'consequat', 'non', 'duis', 'consectetur']
  }, {
    '_id': '57ef9cd8a220db71c82724b6',
    'index': 73,
    'guid': '3715858a-2b15-40b2-bd25-4c5f27f8a242',
    'isActive': false,
    'balance': '$2,007.02',
    'picture': 'http://placehold.it/32x32',
    'age': 40,
    'eyeColor': 'brown',
    'name': 'Mcfadden Stark',
    'gender': 'male',
    'company': 'GEEKOLA',
    'email': 'mcfaddenstark@geekola.com',
    'phone': '+1 (996) 480-2189',
    'address': {
      'street': '422 Livonia Avenue',
      'city': 'Allendale',
      'state': 'Alabama'
    },
    'registered': '2016-06-04',
    'tags': ['qui', 'consequat', 'mollit', 'magna', 'Lorem', 'officia', 'reprehenderit']
  }, {
    '_id': '57ef9cd8ce39d98040920aca',
    'index': 74,
    'guid': '015bb1b1-90c7-47a7-8439-1382355e2198',
    'isActive': false,
    'balance': '$2,762.45',
    'picture': 'http://placehold.it/32x32',
    'age': 39,
    'eyeColor': 'brown',
    'name': 'Haney Schwartz',
    'gender': 'male',
    'company': 'GEOSTELE',
    'email': 'haneyschwartz@geostele.com',
    'phone': '+1 (845) 531-2525',
    'address': {
      'street': '308 Poplar Avenue',
      'city': 'Wolcott',
      'state': 'Palau'
    },
    'registered': '2016-05-11',
    'tags': ['proident', 'enim', 'sunt', 'laborum', 'exercitation', 'dolore', 'cillum']
  }, {
    '_id': '57ef9cd890c774293d1b0fb4',
    'index': 75,
    'guid': 'd073457d-da93-48aa-8c60-02d9d72ef8fb',
    'isActive': false,
    'balance': '$1,206.03',
    'picture': 'http://placehold.it/32x32',
    'age': 34,
    'eyeColor': 'brown',
    'name': 'Bobbie Livingston',
    'gender': 'female',
    'company': 'CORPULSE',
    'email': 'bobbielivingston@corpulse.com',
    'phone': '+1 (836) 495-2861',
    'address': {
      'street': '655 Laurel Avenue',
      'city': 'Eastmont',
      'state': 'Indiana'
    },
    'registered': '2015-09-02',
    'tags': ['proident', 'laboris', 'ut', 'exercitation', 'labore', 'proident', 'adipisicing']
  }, {
    '_id': '57ef9cd8e27b869852bce881',
    'index': 76,
    'guid': '8f740d74-174c-4383-bf25-d97b57bae01d',
    'isActive': false,
    'balance': '$2,399.50',
    'picture': 'http://placehold.it/32x32',
    'age': 35,
    'eyeColor': 'brown',
    'name': 'Ball Talley',
    'gender': 'male',
    'company': 'GOKO',
    'email': 'balltalley@goko.com',
    'phone': '+1 (994) 551-2840',
    'address': {
      'street': '271 Hanover Place',
      'city': 'Kipp',
      'state': 'Iowa'
    },
    'registered': '2016-04-07',
    'tags': ['nisi', 'consequat', 'labore', 'occaecat', 'magna', 'duis', 'ullamco']
  }, {
    '_id': '57ef9cd8971d5bf7c2ba6a2e',
    'index': 77,
    'guid': 'df18fc2c-8480-4396-93ea-4db26c228f7e',
    'isActive': true,
    'balance': '$3,772.45',
    'picture': 'http://placehold.it/32x32',
    'age': 20,
    'eyeColor': 'brown',
    'name': 'Tara Mcknight',
    'gender': 'female',
    'company': 'COMTENT',
    'email': 'taramcknight@comtent.com',
    'phone': '+1 (932) 574-3393',
    'address': {
      'street': '619 Argyle Road',
      'city': 'Roulette',
      'state': 'Northern Mariana Islands'
    },
    'registered': '2015-11-21',
    'tags': ['reprehenderit', 'occaecat', 'culpa', 'anim', 'eiusmod', 'labore', 'fugiat']
  }, {
    '_id': '57ef9cd890abec4d44010eea',
    'index': 78,
    'guid': '74ee47e9-0a58-4a57-80d9-98571e613ae0',
    'isActive': true,
    'balance': '$1,971.96',
    'picture': 'http://placehold.it/32x32',
    'age': 21,
    'eyeColor': 'brown',
    'name': 'Ebony Miller',
    'gender': 'female',
    'company': 'TETRATREX',
    'email': 'ebonymiller@tetratrex.com',
    'phone': '+1 (953) 596-3683',
    'address': {
      'street': '451 Landis Court',
      'city': 'Elrama',
      'state': 'Tennessee'
    },
    'registered': '2015-05-06',
    'tags': ['reprehenderit', 'voluptate', 'ipsum', 'Lorem', 'ea', 'deserunt', 'duis']
  }, {
    '_id': '57ef9cd8e8a49916e0eef4a3',
    'index': 79,
    'guid': '1a5eb28e-ba61-4abf-95d1-cf69373ac673',
    'isActive': true,
    'balance': '$3,136.92',
    'picture': 'http://placehold.it/32x32',
    'age': 35,
    'eyeColor': 'green',
    'name': 'Sexton James',
    'gender': 'male',
    'company': 'XLEEN',
    'email': 'sextonjames@xleen.com',
    'phone': '+1 (886) 443-3743',
    'address': {
      'street': '565 Dobbin Street',
      'city': 'Hessville',
      'state': 'District Of Columbia'
    },
    'registered': '2016-03-23',
    'tags': ['ea', 'veniam', 'ut', 'aute', 'aliquip', 'ea', 'consectetur']
  }, {
    '_id': '57ef9cd89c8e57302ca806f7',
    'index': 80,
    'guid': 'ad19546d-5b93-4dd0-a19f-53e4eb4d79aa',
    'isActive': true,
    'balance': '$2,174.53',
    'picture': 'http://placehold.it/32x32',
    'age': 40,
    'eyeColor': 'brown',
    'name': 'Barr Espinoza',
    'gender': 'male',
    'company': 'PETICULAR',
    'email': 'barrespinoza@peticular.com',
    'phone': '+1 (863) 570-3563',
    'address': {
      'street': '492 Underhill Avenue',
      'city': 'Gratton',
      'state': 'Marshall Islands'
    },
    'registered': '2016-08-18',
    'tags': ['ullamco', 'cillum', 'ullamco', 'exercitation', 'irure', 'esse', 'aliquip']
  }, {
    '_id': '57ef9cd84211c7823bf419cf',
    'index': 81,
    'guid': '9c75ad58-fbf9-49c3-a3cc-ec0e747cbc2c',
    'isActive': true,
    'balance': '$2,401.76',
    'picture': 'http://placehold.it/32x32',
    'age': 29,
    'eyeColor': 'green',
    'name': 'Christa Lawson',
    'gender': 'female',
    'company': 'ENTALITY',
    'email': 'christalawson@entality.com',
    'phone': '+1 (887) 449-2183',
    'address': {
      'street': '625 Grafton Street',
      'city': 'Cresaptown',
      'state': 'Florida'
    },
    'registered': '2014-03-09',
    'tags': ['in', 'ea', 'elit', 'sit', 'elit', 'laboris', 'labore']
  }, {
    '_id': '57ef9cd8deb2a837eee99361',
    'index': 82,
    'guid': '439349b3-b4e5-4e22-b074-d3d8d053986c',
    'isActive': true,
    'balance': '$3,718.44',
    'picture': 'http://placehold.it/32x32',
    'age': 38,
    'eyeColor': 'blue',
    'name': 'Carla Gray',
    'gender': 'female',
    'company': 'NETPLODE',
    'email': 'carlagray@netplode.com',
    'phone': '+1 (831) 547-3290',
    'address': {
      'street': '129 Mill Street',
      'city': 'Austinburg',
      'state': 'Texas'
    },
    'registered': '2014-03-23',
    'tags': ['non', 'tempor', 'eu', 'ipsum', 'voluptate', 'exercitation', 'officia']
  }, {
    '_id': '57ef9cd846d6320f8ee38cd6',
    'index': 83,
    'guid': 'ff535f76-d5ed-4d07-9e5d-1426a6a649f1',
    'isActive': true,
    'balance': '$2,427.75',
    'picture': 'http://placehold.it/32x32',
    'age': 23,
    'eyeColor': 'blue',
    'name': 'Aurora Banks',
    'gender': 'female',
    'company': 'BEDDER',
    'email': 'aurorabanks@bedder.com',
    'phone': '+1 (936) 433-3077',
    'address': {
      'street': '498 Louis Place',
      'city': 'Canby',
      'state': 'South Carolina'
    },
    'registered': '2015-08-29',
    'tags': ['eu', 'mollit', 'et', 'mollit', 'laborum', 'incididunt', 'aute']
  }, {
    '_id': '57ef9cd893f2a82424d8f6ee',
    'index': 84,
    'guid': '8b007ae2-3474-4eff-bdad-17cd7c378867',
    'isActive': true,
    'balance': '$2,206.37',
    'picture': 'http://placehold.it/32x32',
    'age': 28,
    'eyeColor': 'green',
    'name': 'Ruth Maxwell',
    'gender': 'female',
    'company': 'ZEAM',
    'email': 'ruthmaxwell@zeam.com',
    'phone': '+1 (831) 492-3070',
    'address': {
      'street': '106 Utica Avenue',
      'city': 'Norfolk',
      'state': 'Nevada'
    },
    'registered': '2015-11-12',
    'tags': ['consectetur', 'aliqua', 'sit', 'magna', 'voluptate', 'esse', 'non']
  }, {
    '_id': '57ef9cd8f8c3e6032c08eab0',
    'index': 85,
    'guid': 'b9872ffe-a6dc-4525-ac91-75b356a43ac2',
    'isActive': false,
    'balance': '$1,234.70',
    'picture': 'http://placehold.it/32x32',
    'age': 20,
    'eyeColor': 'brown',
    'name': 'Mayer Edwards',
    'gender': 'male',
    'company': 'POWERNET',
    'email': 'mayeredwards@powernet.com',
    'phone': '+1 (823) 411-3607',
    'address': {
      'street': '539 Jay Street',
      'city': 'Sena',
      'state': 'Delaware'
    },
    'registered': '2015-06-07',
    'tags': ['officia', 'occaecat', 'proident', 'Lorem', 'aute', 'et', 'sit']
  }, {
    '_id': '57ef9cd886542a15d66dc2a6',
    'index': 86,
    'guid': 'a959a4e6-7e0c-41a8-912c-c1280609f486',
    'isActive': true,
    'balance': '$1,686.52',
    'picture': 'http://placehold.it/32x32',
    'age': 23,
    'eyeColor': 'blue',
    'name': 'Caroline Bass',
    'gender': 'female',
    'company': 'ARTWORLDS',
    'email': 'carolinebass@artworlds.com',
    'phone': '+1 (932) 419-2973',
    'address': {
      'street': '858 Pershing Loop',
      'city': 'Sidman',
      'state': 'Kansas'
    },
    'registered': '2015-04-24',
    'tags': ['ea', 'veniam', 'nulla', 'sint', 'proident', 'esse', 'nisi']
  }, {
    '_id': '57ef9cd8f1adf135eb8b5d4f',
    'index': 87,
    'guid': '1ae041da-fddc-4df5-8485-aff3eacbdcf4',
    'isActive': false,
    'balance': '$2,991.87',
    'picture': 'http://placehold.it/32x32',
    'age': 27,
    'eyeColor': 'green',
    'name': 'Walsh Mccarthy',
    'gender': 'male',
    'company': 'FARMAGE',
    'email': 'walshmccarthy@farmage.com',
    'phone': '+1 (921) 500-3805',
    'address': {
      'street': '930 Banker Street',
      'city': 'Nicholson',
      'state': 'California'
    },
    'registered': '2014-10-18',
    'tags': ['laboris', 'ad', 'adipisicing', 'esse', 'sit', 'consequat', 'magna']
  }, {
    '_id': '57ef9cd8e292916e52e972ec',
    'index': 88,
    'guid': '9207f1d2-870c-466e-a1ad-ed2b9af4ad65',
    'isActive': true,
    'balance': '$1,310.82',
    'picture': 'http://placehold.it/32x32',
    'age': 37,
    'eyeColor': 'brown',
    'name': 'Natalie Bond',
    'gender': 'female',
    'company': 'GYNKO',
    'email': 'nataliebond@gynko.com',
    'phone': '+1 (908) 587-2856',
    'address': {
      'street': '698 Madoc Avenue',
      'city': 'Outlook',
      'state': 'New Jersey'
    },
    'registered': '2016-03-30',
    'tags': ['aute', 'magna', 'eiusmod', 'est', 'officia', 'adipisicing', 'amet']
  }, {
    '_id': '57ef9cd8ff15e5092584605b',
    'index': 89,
    'guid': '1cf9890d-2d89-4a98-ac4c-488b47f33ec7',
    'isActive': false,
    'balance': '$1,664.41',
    'picture': 'http://placehold.it/32x32',
    'age': 32,
    'eyeColor': 'green',
    'name': 'Watts Kramer',
    'gender': 'male',
    'company': 'MARKETOID',
    'email': 'wattskramer@marketoid.com',
    'phone': '+1 (981) 572-3764',
    'address': {
      'street': '460 Caton Place',
      'city': 'Southmont',
      'state': 'Wyoming'
    },
    'registered': '2015-02-16',
    'tags': ['occaecat', 'sit', 'amet', 'non', 'sit', 'enim', 'ex']
  }, {
    '_id': '57ef9cd85d843de02021c7a4',
    'index': 90,
    'guid': '095bf361-65f5-42ae-aa51-1973d6ad6a2c',
    'isActive': true,
    'balance': '$1,981.37',
    'picture': 'http://placehold.it/32x32',
    'age': 20,
    'eyeColor': 'green',
    'name': 'Iva Brady',
    'gender': 'female',
    'company': 'COMDOM',
    'email': 'ivabrady@comdom.com',
    'phone': '+1 (942) 514-2261',
    'address': {
      'street': '525 Hoyts Lane',
      'city': 'Waterloo',
      'state': 'Massachusetts'
    },
    'registered': '2015-12-22',
    'tags': ['nisi', 'quis', 'adipisicing', 'et', 'quis', 'esse', 'consequat']
  }, {
    '_id': '57ef9cd8bf5b4c18438c890c',
    'index': 91,
    'guid': 'bfb1f645-a63e-4fc0-9a94-a208396e32f7',
    'isActive': true,
    'balance': '$2,694.33',
    'picture': 'http://placehold.it/32x32',
    'age': 39,
    'eyeColor': 'blue',
    'name': 'Estella Moses',
    'gender': 'female',
    'company': 'UNDERTAP',
    'email': 'estellamoses@undertap.com',
    'phone': '+1 (999) 418-3031',
    'address': {
      'street': '127 Liberty Avenue',
      'city': 'Roy',
      'state': 'Kentucky'
    },
    'registered': '2014-08-10',
    'tags': ['ipsum', 'ea', 'eu', 'duis', 'enim', 'consequat', 'veniam']
  }, {
    '_id': '57ef9cd895135c80288cf57e',
    'index': 92,
    'guid': '6470c22d-0086-4acf-9fdf-7d1762a17e08',
    'isActive': true,
    'balance': '$3,995.47',
    'picture': 'http://placehold.it/32x32',
    'age': 40,
    'eyeColor': 'brown',
    'name': 'Anthony Knight',
    'gender': 'male',
    'company': 'EQUICOM',
    'email': 'anthonyknight@equicom.com',
    'phone': '+1 (873) 569-3224',
    'address': {
      'street': '654 Greene Avenue',
      'city': 'Chamizal',
      'state': 'Arizona'
    },
    'registered': '2014-02-08',
    'tags': ['Lorem', 'duis', 'incididunt', 'nulla', 'Lorem', 'dolor', 'adipisicing']
  }, {
    '_id': '57ef9cd8ca4056877bc2cb23',
    'index': 93,
    'guid': 'fc8ea442-c629-42a1-87dd-c58609c0ebdb',
    'isActive': false,
    'balance': '$3,017.70',
    'picture': 'http://placehold.it/32x32',
    'age': 40,
    'eyeColor': 'blue',
    'name': 'Russell Gilliam',
    'gender': 'male',
    'company': 'BLUEGRAIN',
    'email': 'russellgilliam@bluegrain.com',
    'phone': '+1 (996) 465-2053',
    'address': {
      'street': '400 Columbia Place',
      'city': 'Summerset',
      'state': 'Maryland'
    },
    'registered': '2015-01-19',
    'tags': ['sit', 'eu', 'qui', 'Lorem', 'enim', 'aliquip', 'enim']
  }, {
    '_id': '57ef9cd8723a1463115cbf16',
    'index': 94,
    'guid': '282ddfb3-7c52-4732-80a2-be8c436ee0c9',
    'isActive': true,
    'balance': '$1,448.23',
    'picture': 'http://placehold.it/32x32',
    'age': 35,
    'eyeColor': 'brown',
    'name': 'Mcmahon Reynolds',
    'gender': 'male',
    'company': 'PANZENT',
    'email': 'mcmahonreynolds@panzent.com',
    'phone': '+1 (877) 512-2213',
    'address': {
      'street': '452 Kathleen Court',
      'city': 'Barronett',
      'state': 'Illinois'
    },
    'registered': '2015-04-03',
    'tags': ['qui', 'in', 'qui', 'laboris', 'et', 'nulla', 'id']
  }, {
    '_id': '57ef9cd8d99535859969e271',
    'index': 95,
    'guid': 'ac088fe2-019a-4fd7-bd8c-5d21eeb5e731',
    'isActive': false,
    'balance': '$2,204.60',
    'picture': 'http://placehold.it/32x32',
    'age': 20,
    'eyeColor': 'green',
    'name': 'Rosa Myers',
    'gender': 'female',
    'company': 'LUNCHPAD',
    'email': 'rosamyers@lunchpad.com',
    'phone': '+1 (847) 423-3501',
    'address': {
      'street': '913 Trucklemans Lane',
      'city': 'Lynn',
      'state': 'West Virginia'
    },
    'registered': '2016-06-10',
    'tags': ['veniam', 'consectetur', 'dolor', 'quis', 'anim', 'do', 'sit']
  }, {
    '_id': '57ef9cd802b0ae83a4ed2495',
    'index': 96,
    'guid': '0507ff39-d0be-4f4d-afc0-01458a66d7a9',
    'isActive': true,
    'balance': '$3,655.93',
    'picture': 'http://placehold.it/32x32',
    'age': 28,
    'eyeColor': 'brown',
    'name': 'Angeline Schroeder',
    'gender': 'female',
    'company': 'ZORROMOP',
    'email': 'angelineschroeder@zorromop.com',
    'phone': '+1 (852) 421-2895',
    'address': {
      'street': '195 Sumpter Street',
      'city': 'Washington',
      'state': 'Alaska'
    },
    'registered': '2015-05-21',
    'tags': ['dolor', 'dolor', 'nulla', 'id', 'mollit', 'eiusmod', 'ut']
  }, {
    '_id': '57ef9cd82e8295c9e6edee99',
    'index': 97,
    'guid': '322617dc-ac2f-4076-bec9-7539ec959ad2',
    'isActive': true,
    'balance': '$1,675.25',
    'picture': 'http://placehold.it/32x32',
    'age': 24,
    'eyeColor': 'brown',
    'name': 'Hall Atkinson',
    'gender': 'male',
    'company': 'UNIA',
    'email': 'hallatkinson@unia.com',
    'phone': '+1 (847) 412-2997',
    'address': {
      'street': '864 Pierrepont Street',
      'city': 'Caroleen',
      'state': 'Oklahoma'
    },
    'registered': '2016-01-02',
    'tags': ['quis', 'id', 'quis', 'consequat', 'enim', 'esse', 'elit']
  }, {
    '_id': '57ef9cd8864bcc1330fa009c',
    'index': 98,
    'guid': '3c336f09-140a-423b-963d-e49a0864b214',
    'isActive': false,
    'balance': '$2,141.56',
    'picture': 'http://placehold.it/32x32',
    'age': 28,
    'eyeColor': 'brown',
    'name': 'Paulette Sellers',
    'gender': 'female',
    'company': 'ARCTIQ',
    'email': 'paulettesellers@arctiq.com',
    'phone': '+1 (937) 462-3359',
    'address': {
      'street': '130 Ovington Court',
      'city': 'Diaperville',
      'state': 'Federated States Of Micronesia'
    },
    'registered': '2014-10-28',
    'tags': ['aliqua', 'occaecat', 'ut', 'dolor', 'dolor', 'irure', 'pariatur']
  }, {
    '_id': '57ef9cd88bbbbcdd7e59618f',
    'index': 99,
    'guid': '6854d791-09f7-46c2-b66c-bcc0ba82d654',
    'isActive': true,
    'balance': '$1,683.05',
    'picture': 'http://placehold.it/32x32',
    'age': 31,
    'eyeColor': 'brown',
    'name': 'Key Black',
    'gender': 'male',
    'company': 'MAINELAND',
    'email': 'keyblack@maineland.com',
    'phone': '+1 (920) 536-2044',
    'address': {
      'street': '326 Melrose Street',
      'city': 'Denio',
      'state': 'Vermont'
    },
    'registered': '2016-08-06',
    'tags': ['tempor', 'enim', 'elit', 'cupidatat', 'ipsum', 'ipsum', 'in']
  }];
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('home',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Home = exports.Home = function Home() {
    _classCallCheck(this, Home);

    this.message = 'Welcome Home';
  };
});
define('main',['exports', './environment', 'i18next-xhr-backend'], function (exports, _environment, _i18nextXhrBackend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  var _i18nextXhrBackend2 = _interopRequireDefault(_i18nextXhrBackend);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.use.plugin('aurelia-table').plugin('aurelia-i18n', function (instance) {
      instance.i18next.use(_i18nextXhrBackend2.default);
      return instance.setup({
        backend: {
          loadPath: './locales/{{lng}}/{{ns}}.json'
        },
        lng: 'id',
        attributes: ['t', 'i18n'],
        fallbackLng: 'en',
        debug: true
      });
    });

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('map',['exports', 'aurelia-framework', 'aurelia-router', 'aurelia-i18n', 'leaflet', 'topojson-client', './api', './utils', './data'], function (exports, _aureliaFramework, _aureliaRouter, _aureliaI18n, _leaflet, _topojsonClient, _api, _utils, _data) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Map = undefined;

  var L = _interopRequireWildcard(_leaflet);

  var topojson = _interopRequireWildcard(_topojsonClient);

  var _data2 = _interopRequireDefault(_data);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var config = {
    region: 'jbd',
    bounds: {
      sw: [-6.733, 106.480],
      ne: [-5.880, 107.175]
    },
    tile_layer: 'https://api.mapbox.com/styles/v1/urbanriskmap/ciwwgpt9j004a2prwm9cylsrc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidXJiYW5yaXNrbWFwIiwiYSI6ImNpdmVhbTFraDAwNHIyeWw1ZDB6Y2hhbTYifQ.tpgt1PB5lkJ-wITS02c96Q',
    infrastructure: ['waterways', 'pumps', 'floodgates']
  };

  L.TopoJSON = L.GeoJSON.extend({
    addData: function addData(topoJson) {
      if (topoJson.type === 'Topology') {
        var geojson = topojson.feature(topoJson, topoJson.objects.output);
        L.GeoJSON.prototype.addData.call(undefined, geojson);
      }
    }
  });

  var Map = exports.Map = (_dec = (0, _aureliaFramework.inject)(_api.API, _aureliaI18n.I18N), _dec(_class = function () {
    function Map(api, i18n) {
      _classCallCheck(this, Map);

      this.api = api;
      this.i18n = i18n;
      this.users = _data2.default;
      this.pageSize = 5;
    }

    Map.prototype.attached = function attached() {
      var _this = this;

      this.map = L.map('mapContainer', {
        attributionControl: false
      }).fitBounds([config.bounds.sw, config.bounds.ne]);

      L.tileLayer(config.tile_layer, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OSM</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
        detectRetina: true,
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 18,
        ext: 'png'
      }).addTo(this.map);

      var topoLayer = new L.TopoJSON();
      topoLayer.addTo(this.map);

      for (var _iterator = config.infrastructure, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var type = _ref;

        this.api.getInfrastructure(type).then(function (data) {}).catch(function (err) {
          return _this.error = err.message;
        });
      }
    };

    Map.prototype.canActivate = function canActivate() {
      if ((0, _utils.tokenIsExpired)()) return new _aureliaRouter.Redirect('');
      return true;
    };

    return Map;
  }()) || _class);
});
define('utils',['exports', 'jwt-decode'], function (exports, jwtDecode) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.tokenIsExpired = tokenIsExpired;
  function tokenIsExpired() {
    var jwt = localStorage.getItem('id_token');
    if (jwt) {
      var jwtExp = jwtDecode(jwt).exp;
      var expiryDate = new Date(0);
      expiryDate.setUTCSeconds(jwtExp);

      if (new Date() < expiryDate) return false;
    }
    return true;
  }
});
define('resources/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    config.globalResources(['./elements/loading-indicator']);
  }
});
define('resources/elements/loading-indicator',['exports', 'nprogress', 'aurelia-framework'], function (exports, _nprogress, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LoadingIndicator = undefined;

  var nprogress = _interopRequireWildcard(_nprogress);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  nprogress.configure({ showSpinner: false });

  var LoadingIndicator = exports.LoadingIndicator = (0, _aureliaFramework.decorators)((0, _aureliaFramework.noView)(['nprogress/nprogress.css']), (0, _aureliaFramework.bindable)({ name: 'loading', defaultValue: false })).on(function () {
    function _class() {
      _classCallCheck(this, _class);
    }

    _class.prototype.loadingChanged = function loadingChanged(newValue) {
      if (newValue) {
        nprogress.start();
      } else {
        nprogress.done();
      }
    };

    return _class;
  }());
});
define('aurelia-templating-resources/compose',['exports', 'aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-templating', 'aurelia-pal'], function (exports, _aureliaDependencyInjection, _aureliaTaskQueue, _aureliaTemplating, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Compose = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var Compose = exports.Compose = (_dec = (0, _aureliaTemplating.customElement)('compose'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaTaskQueue.TaskQueue), _dec(_class = (0, _aureliaTemplating.noView)(_class = _dec2(_class = (_class2 = function () {
    function Compose(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
      

      _initDefineProp(this, 'model', _descriptor, this);

      _initDefineProp(this, 'view', _descriptor2, this);

      _initDefineProp(this, 'viewModel', _descriptor3, this);

      this.element = element;
      this.container = container;
      this.compositionEngine = compositionEngine;
      this.viewSlot = viewSlot;
      this.viewResources = viewResources;
      this.taskQueue = taskQueue;
      this.currentController = null;
      this.currentViewModel = null;
    }

    Compose.prototype.created = function created(owningView) {
      this.owningView = owningView;
    };

    Compose.prototype.bind = function bind(bindingContext, overrideContext) {
      this.bindingContext = bindingContext;
      this.overrideContext = overrideContext;
      processInstruction(this, createInstruction(this, {
        view: this.view,
        viewModel: this.viewModel,
        model: this.model
      }));
    };

    Compose.prototype.unbind = function unbind(bindingContext, overrideContext) {
      this.bindingContext = null;
      this.overrideContext = null;
      var returnToCache = true;
      var skipAnimation = true;
      this.viewSlot.removeAll(returnToCache, skipAnimation);
    };

    Compose.prototype.modelChanged = function modelChanged(newValue, oldValue) {
      var _this = this;

      if (this.currentInstruction) {
        this.currentInstruction.model = newValue;
        return;
      }

      this.taskQueue.queueMicroTask(function () {
        if (_this.currentInstruction) {
          _this.currentInstruction.model = newValue;
          return;
        }

        var vm = _this.currentViewModel;

        if (vm && typeof vm.activate === 'function') {
          vm.activate(newValue);
        }
      });
    };

    Compose.prototype.viewChanged = function viewChanged(newValue, oldValue) {
      var _this2 = this;

      var instruction = createInstruction(this, {
        view: newValue,
        viewModel: this.currentViewModel || this.viewModel,
        model: this.model
      });

      if (this.currentInstruction) {
        this.currentInstruction = instruction;
        return;
      }

      this.currentInstruction = instruction;
      this.taskQueue.queueMicroTask(function () {
        return processInstruction(_this2, _this2.currentInstruction);
      });
    };

    Compose.prototype.viewModelChanged = function viewModelChanged(newValue, oldValue) {
      var _this3 = this;

      var instruction = createInstruction(this, {
        viewModel: newValue,
        view: this.view,
        model: this.model
      });

      if (this.currentInstruction) {
        this.currentInstruction = instruction;
        return;
      }

      this.currentInstruction = instruction;
      this.taskQueue.queueMicroTask(function () {
        return processInstruction(_this3, _this3.currentInstruction);
      });
    };

    return Compose;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'model', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'view', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'viewModel', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class) || _class);


  function createInstruction(composer, instruction) {
    return Object.assign(instruction, {
      bindingContext: composer.bindingContext,
      overrideContext: composer.overrideContext,
      owningView: composer.owningView,
      container: composer.container,
      viewSlot: composer.viewSlot,
      viewResources: composer.viewResources,
      currentController: composer.currentController,
      host: composer.element
    });
  }

  function processInstruction(composer, instruction) {
    composer.currentInstruction = null;
    composer.compositionEngine.compose(instruction).then(function (controller) {
      composer.currentController = controller;
      composer.currentViewModel = controller ? controller.viewModel : null;
    });
  }
});
define('aurelia-templating-resources/if',['exports', 'aurelia-templating', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.If = undefined;

  

  var _dec, _dec2, _class;

  var If = exports.If = (_dec = (0, _aureliaTemplating.customAttribute)('if'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
    function If(viewFactory, viewSlot) {
      

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.showing = false;
      this.view = null;
      this.bindingContext = null;
      this.overrideContext = null;
    }

    If.prototype.bind = function bind(bindingContext, overrideContext) {
      this.bindingContext = bindingContext;
      this.overrideContext = overrideContext;
      this.valueChanged(this.value);
    };

    If.prototype.valueChanged = function valueChanged(newValue) {
      var _this = this;

      if (this.__queuedChanges) {
        this.__queuedChanges.push(newValue);
        return;
      }

      var maybePromise = this._runValueChanged(newValue);
      if (maybePromise instanceof Promise) {
        (function () {
          var queuedChanges = _this.__queuedChanges = [];

          var runQueuedChanges = function runQueuedChanges() {
            if (!queuedChanges.length) {
              _this.__queuedChanges = undefined;
              return;
            }

            var nextPromise = _this._runValueChanged(queuedChanges.shift()) || Promise.resolve();
            nextPromise.then(runQueuedChanges);
          };

          maybePromise.then(runQueuedChanges);
        })();
      }
    };

    If.prototype._runValueChanged = function _runValueChanged(newValue) {
      var _this2 = this;

      if (!newValue) {
        var viewOrPromise = void 0;
        if (this.view !== null && this.showing) {
          viewOrPromise = this.viewSlot.remove(this.view);
          if (viewOrPromise instanceof Promise) {
            viewOrPromise.then(function () {
              return _this2.view.unbind();
            });
          } else {
            this.view.unbind();
          }
        }

        this.showing = false;
        return viewOrPromise;
      }

      if (this.view === null) {
        this.view = this.viewFactory.create();
      }

      if (!this.view.isBound) {
        this.view.bind(this.bindingContext, this.overrideContext);
      }

      if (!this.showing) {
        this.showing = true;
        return this.viewSlot.add(this.view);
      }

      return undefined;
    };

    If.prototype.unbind = function unbind() {
      if (this.view === null) {
        return;
      }

      this.view.unbind();

      if (!this.viewFactory.isCaching) {
        return;
      }

      if (this.showing) {
        this.showing = false;
        this.viewSlot.remove(this.view, true, true);
      }
      this.view.returnToCache();
      this.view = null;
    };

    return If;
  }()) || _class) || _class) || _class);
});
define('aurelia-templating-resources/with',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-binding'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.With = undefined;

  

  var _dec, _dec2, _class;

  var With = exports.With = (_dec = (0, _aureliaTemplating.customAttribute)('with'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
    function With(viewFactory, viewSlot) {
      

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.parentOverrideContext = null;
      this.view = null;
    }

    With.prototype.bind = function bind(bindingContext, overrideContext) {
      this.parentOverrideContext = overrideContext;
      this.valueChanged(this.value);
    };

    With.prototype.valueChanged = function valueChanged(newValue) {
      var overrideContext = (0, _aureliaBinding.createOverrideContext)(newValue, this.parentOverrideContext);
      if (!this.view) {
        this.view = this.viewFactory.create();
        this.view.bind(newValue, overrideContext);
        this.viewSlot.add(this.view);
      } else {
        this.view.bind(newValue, overrideContext);
      }
    };

    With.prototype.unbind = function unbind() {
      this.parentOverrideContext = null;

      if (this.view) {
        this.view.unbind();
      }
    };

    return With;
  }()) || _class) || _class) || _class);
});
define('aurelia-templating-resources/repeat',['exports', 'aurelia-dependency-injection', 'aurelia-binding', 'aurelia-templating', './repeat-strategy-locator', './repeat-utilities', './analyze-view-factory', './abstract-repeater'], function (exports, _aureliaDependencyInjection, _aureliaBinding, _aureliaTemplating, _repeatStrategyLocator, _repeatUtilities, _analyzeViewFactory, _abstractRepeater) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Repeat = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var Repeat = exports.Repeat = (_dec = (0, _aureliaTemplating.customAttribute)('repeat'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.TargetInstruction, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaBinding.ObserverLocator, _repeatStrategyLocator.RepeatStrategyLocator), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = (_class2 = function (_AbstractRepeater) {
    _inherits(Repeat, _AbstractRepeater);

    function Repeat(viewFactory, instruction, viewSlot, viewResources, observerLocator, strategyLocator) {
      

      var _this = _possibleConstructorReturn(this, _AbstractRepeater.call(this, {
        local: 'item',
        viewsRequireLifecycle: (0, _analyzeViewFactory.viewsRequireLifecycle)(viewFactory)
      }));

      _initDefineProp(_this, 'items', _descriptor, _this);

      _initDefineProp(_this, 'local', _descriptor2, _this);

      _initDefineProp(_this, 'key', _descriptor3, _this);

      _initDefineProp(_this, 'value', _descriptor4, _this);

      _this.viewFactory = viewFactory;
      _this.instruction = instruction;
      _this.viewSlot = viewSlot;
      _this.lookupFunctions = viewResources.lookupFunctions;
      _this.observerLocator = observerLocator;
      _this.key = 'key';
      _this.value = 'value';
      _this.strategyLocator = strategyLocator;
      _this.ignoreMutation = false;
      _this.sourceExpression = (0, _repeatUtilities.getItemsSourceExpression)(_this.instruction, 'repeat.for');
      _this.isOneTime = (0, _repeatUtilities.isOneTime)(_this.sourceExpression);
      _this.viewsRequireLifecycle = (0, _analyzeViewFactory.viewsRequireLifecycle)(viewFactory);
      return _this;
    }

    Repeat.prototype.call = function call(context, changes) {
      this[context](this.items, changes);
    };

    Repeat.prototype.bind = function bind(bindingContext, overrideContext) {
      this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
      this.matcherBinding = this._captureAndRemoveMatcherBinding();
      this.itemsChanged();
    };

    Repeat.prototype.unbind = function unbind() {
      this.scope = null;
      this.items = null;
      this.matcherBinding = null;
      this.viewSlot.removeAll(true);
      this._unsubscribeCollection();
    };

    Repeat.prototype._unsubscribeCollection = function _unsubscribeCollection() {
      if (this.collectionObserver) {
        this.collectionObserver.unsubscribe(this.callContext, this);
        this.collectionObserver = null;
        this.callContext = null;
      }
    };

    Repeat.prototype.itemsChanged = function itemsChanged() {
      this._unsubscribeCollection();

      if (!this.scope) {
        return;
      }

      var items = this.items;
      this.strategy = this.strategyLocator.getStrategy(items);
      if (!this.strategy) {
        throw new Error('Value for \'' + this.sourceExpression + '\' is non-repeatable');
      }

      if (!this.isOneTime && !this._observeInnerCollection()) {
        this._observeCollection();
      }
      this.strategy.instanceChanged(this, items);
    };

    Repeat.prototype._getInnerCollection = function _getInnerCollection() {
      var expression = (0, _repeatUtilities.unwrapExpression)(this.sourceExpression);
      if (!expression) {
        return null;
      }
      return expression.evaluate(this.scope, null);
    };

    Repeat.prototype.handleCollectionMutated = function handleCollectionMutated(collection, changes) {
      if (!this.collectionObserver) {
        return;
      }
      this.strategy.instanceMutated(this, collection, changes);
    };

    Repeat.prototype.handleInnerCollectionMutated = function handleInnerCollectionMutated(collection, changes) {
      var _this2 = this;

      if (!this.collectionObserver) {
        return;
      }

      if (this.ignoreMutation) {
        return;
      }
      this.ignoreMutation = true;
      var newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
      this.observerLocator.taskQueue.queueMicroTask(function () {
        return _this2.ignoreMutation = false;
      });

      if (newItems === this.items) {
        this.itemsChanged();
      } else {
        this.items = newItems;
      }
    };

    Repeat.prototype._observeInnerCollection = function _observeInnerCollection() {
      var items = this._getInnerCollection();
      var strategy = this.strategyLocator.getStrategy(items);
      if (!strategy) {
        return false;
      }
      this.collectionObserver = strategy.getCollectionObserver(this.observerLocator, items);
      if (!this.collectionObserver) {
        return false;
      }
      this.callContext = 'handleInnerCollectionMutated';
      this.collectionObserver.subscribe(this.callContext, this);
      return true;
    };

    Repeat.prototype._observeCollection = function _observeCollection() {
      var items = this.items;
      this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, items);
      if (this.collectionObserver) {
        this.callContext = 'handleCollectionMutated';
        this.collectionObserver.subscribe(this.callContext, this);
      }
    };

    Repeat.prototype._captureAndRemoveMatcherBinding = function _captureAndRemoveMatcherBinding() {
      if (this.viewFactory.viewFactory) {
        var instructions = this.viewFactory.viewFactory.instructions;
        var instructionIds = Object.keys(instructions);
        for (var i = 0; i < instructionIds.length; i++) {
          var expressions = instructions[instructionIds[i]].expressions;
          if (expressions) {
            for (var ii = 0; i < expressions.length; i++) {
              if (expressions[ii].targetProperty === 'matcher') {
                var matcherBinding = expressions[ii];
                expressions.splice(ii, 1);
                return matcherBinding;
              }
            }
          }
        }
      }

      return undefined;
    };

    Repeat.prototype.viewCount = function viewCount() {
      return this.viewSlot.children.length;
    };

    Repeat.prototype.views = function views() {
      return this.viewSlot.children;
    };

    Repeat.prototype.view = function view(index) {
      return this.viewSlot.children[index];
    };

    Repeat.prototype.matcher = function matcher() {
      return this.matcherBinding ? this.matcherBinding.sourceExpression.evaluate(this.scope, this.matcherBinding.lookupFunctions) : null;
    };

    Repeat.prototype.addView = function addView(bindingContext, overrideContext) {
      var view = this.viewFactory.create();
      view.bind(bindingContext, overrideContext);
      this.viewSlot.add(view);
    };

    Repeat.prototype.insertView = function insertView(index, bindingContext, overrideContext) {
      var view = this.viewFactory.create();
      view.bind(bindingContext, overrideContext);
      this.viewSlot.insert(index, view);
    };

    Repeat.prototype.moveView = function moveView(sourceIndex, targetIndex) {
      this.viewSlot.move(sourceIndex, targetIndex);
    };

    Repeat.prototype.removeAllViews = function removeAllViews(returnToCache, skipAnimation) {
      return this.viewSlot.removeAll(returnToCache, skipAnimation);
    };

    Repeat.prototype.removeViews = function removeViews(viewsToRemove, returnToCache, skipAnimation) {
      return this.viewSlot.removeMany(viewsToRemove, returnToCache, skipAnimation);
    };

    Repeat.prototype.removeView = function removeView(index, returnToCache, skipAnimation) {
      return this.viewSlot.removeAt(index, returnToCache, skipAnimation);
    };

    Repeat.prototype.updateBindings = function updateBindings(view) {
      var j = view.bindings.length;
      while (j--) {
        (0, _repeatUtilities.updateOneTimeBinding)(view.bindings[j]);
      }
      j = view.controllers.length;
      while (j--) {
        var k = view.controllers[j].boundProperties.length;
        while (k--) {
          var binding = view.controllers[j].boundProperties[k].binding;
          (0, _repeatUtilities.updateOneTimeBinding)(binding);
        }
      }
    };

    return Repeat;
  }(_abstractRepeater.AbstractRepeater), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'items', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'local', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'key', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'value', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class) || _class);
});
define('aurelia-templating-resources/repeat-strategy-locator',['exports', './null-repeat-strategy', './array-repeat-strategy', './map-repeat-strategy', './set-repeat-strategy', './number-repeat-strategy'], function (exports, _nullRepeatStrategy, _arrayRepeatStrategy, _mapRepeatStrategy, _setRepeatStrategy, _numberRepeatStrategy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RepeatStrategyLocator = undefined;

  

  var RepeatStrategyLocator = exports.RepeatStrategyLocator = function () {
    function RepeatStrategyLocator() {
      

      this.matchers = [];
      this.strategies = [];

      this.addStrategy(function (items) {
        return items === null || items === undefined;
      }, new _nullRepeatStrategy.NullRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Array;
      }, new _arrayRepeatStrategy.ArrayRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Map;
      }, new _mapRepeatStrategy.MapRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Set;
      }, new _setRepeatStrategy.SetRepeatStrategy());
      this.addStrategy(function (items) {
        return typeof items === 'number';
      }, new _numberRepeatStrategy.NumberRepeatStrategy());
    }

    RepeatStrategyLocator.prototype.addStrategy = function addStrategy(matcher, strategy) {
      this.matchers.push(matcher);
      this.strategies.push(strategy);
    };

    RepeatStrategyLocator.prototype.getStrategy = function getStrategy(items) {
      var matchers = this.matchers;

      for (var i = 0, ii = matchers.length; i < ii; ++i) {
        if (matchers[i](items)) {
          return this.strategies[i];
        }
      }

      return null;
    };

    return RepeatStrategyLocator;
  }();
});
define('aurelia-templating-resources/null-repeat-strategy',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var NullRepeatStrategy = exports.NullRepeatStrategy = function () {
    function NullRepeatStrategy() {
      
    }

    NullRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      repeat.removeAllViews(true);
    };

    NullRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {};

    return NullRepeatStrategy;
  }();
});
define('aurelia-templating-resources/array-repeat-strategy',['exports', './repeat-utilities', 'aurelia-binding'], function (exports, _repeatUtilities, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ArrayRepeatStrategy = undefined;

  

  var ArrayRepeatStrategy = exports.ArrayRepeatStrategy = function () {
    function ArrayRepeatStrategy() {
      
    }

    ArrayRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getArrayObserver(items);
    };

    ArrayRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var itemsLength = items.length;

      if (!items || itemsLength === 0) {
        repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        return;
      }

      var children = repeat.views();
      var viewsLength = children.length;

      if (viewsLength === 0) {
        this._standardProcessInstanceChanged(repeat, items);
        return;
      }

      if (repeat.viewsRequireLifecycle) {
        (function () {
          var childrenSnapshot = children.slice(0);
          var itemNameInBindingContext = repeat.local;
          var matcher = repeat.matcher();

          var itemsPreviouslyInViews = [];
          var viewsToRemove = [];

          for (var index = 0; index < viewsLength; index++) {
            var view = childrenSnapshot[index];
            var oldItem = view.bindingContext[itemNameInBindingContext];

            if ((0, _repeatUtilities.indexOf)(items, oldItem, matcher) === -1) {
              viewsToRemove.push(view);
            } else {
              itemsPreviouslyInViews.push(oldItem);
            }
          }

          var updateViews = void 0;
          var removePromise = void 0;

          if (itemsPreviouslyInViews.length > 0) {
            removePromise = repeat.removeViews(viewsToRemove, true, !repeat.viewsRequireLifecycle);
            updateViews = function updateViews() {
              for (var _index = 0; _index < itemsLength; _index++) {
                var item = items[_index];
                var indexOfView = (0, _repeatUtilities.indexOf)(itemsPreviouslyInViews, item, matcher, _index);
                var _view = void 0;

                if (indexOfView === -1) {
                  var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, items[_index], _index, itemsLength);
                  repeat.insertView(_index, overrideContext.bindingContext, overrideContext);

                  itemsPreviouslyInViews.splice(_index, 0, undefined);
                } else if (indexOfView === _index) {
                  _view = children[indexOfView];
                  itemsPreviouslyInViews[indexOfView] = undefined;
                } else {
                  _view = children[indexOfView];
                  repeat.moveView(indexOfView, _index);
                  itemsPreviouslyInViews.splice(indexOfView, 1);
                  itemsPreviouslyInViews.splice(_index, 0, undefined);
                }

                if (_view) {
                  (0, _repeatUtilities.updateOverrideContext)(_view.overrideContext, _index, itemsLength);
                }
              }

              _this._inPlaceProcessItems(repeat, items);
            };
          } else {
            removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            updateViews = function updateViews() {
              return _this._standardProcessInstanceChanged(repeat, items);
            };
          }

          if (removePromise instanceof Promise) {
            removePromise.then(updateViews);
          } else {
            updateViews();
          }
        })();
      } else {
        this._inPlaceProcessItems(repeat, items);
      }
    };

    ArrayRepeatStrategy.prototype._standardProcessInstanceChanged = function _standardProcessInstanceChanged(repeat, items) {
      for (var i = 0, ii = items.length; i < ii; i++) {
        var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, items[i], i, ii);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }
    };

    ArrayRepeatStrategy.prototype._inPlaceProcessItems = function _inPlaceProcessItems(repeat, items) {
      var itemsLength = items.length;
      var viewsLength = repeat.viewCount();

      while (viewsLength > itemsLength) {
        viewsLength--;
        repeat.removeView(viewsLength, true, !repeat.viewsRequireLifecycle);
      }

      var local = repeat.local;

      for (var i = 0; i < viewsLength; i++) {
        var view = repeat.view(i);
        var last = i === itemsLength - 1;
        var middle = i !== 0 && !last;

        if (view.bindingContext[local] === items[i] && view.overrideContext.$middle === middle && view.overrideContext.$last === last) {
          continue;
        }

        view.bindingContext[local] = items[i];
        view.overrideContext.$middle = middle;
        view.overrideContext.$last = last;
        repeat.updateBindings(view);
      }

      for (var _i = viewsLength; _i < itemsLength; _i++) {
        var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, items[_i], _i, itemsLength);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }
    };

    ArrayRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, array, splices) {
      var _this2 = this;

      if (repeat.__queuedSplices) {
        for (var i = 0, ii = splices.length; i < ii; ++i) {
          var _splices$i = splices[i],
              index = _splices$i.index,
              removed = _splices$i.removed,
              addedCount = _splices$i.addedCount;

          (0, _aureliaBinding.mergeSplice)(repeat.__queuedSplices, index, removed, addedCount);
        }

        repeat.__array = array.slice(0);
        return;
      }

      var maybePromise = this._runSplices(repeat, array.slice(0), splices);
      if (maybePromise instanceof Promise) {
        (function () {
          var queuedSplices = repeat.__queuedSplices = [];

          var runQueuedSplices = function runQueuedSplices() {
            if (!queuedSplices.length) {
              repeat.__queuedSplices = undefined;
              repeat.__array = undefined;
              return;
            }

            var nextPromise = _this2._runSplices(repeat, repeat.__array, queuedSplices) || Promise.resolve();
            queuedSplices = repeat.__queuedSplices = [];
            nextPromise.then(runQueuedSplices);
          };

          maybePromise.then(runQueuedSplices);
        })();
      }
    };

    ArrayRepeatStrategy.prototype._runSplices = function _runSplices(repeat, array, splices) {
      var _this3 = this;

      var removeDelta = 0;
      var rmPromises = [];

      for (var i = 0, ii = splices.length; i < ii; ++i) {
        var splice = splices[i];
        var removed = splice.removed;

        for (var j = 0, jj = removed.length; j < jj; ++j) {
          var viewOrPromise = repeat.removeView(splice.index + removeDelta + rmPromises.length, true);
          if (viewOrPromise instanceof Promise) {
            rmPromises.push(viewOrPromise);
          }
        }
        removeDelta -= splice.addedCount;
      }

      if (rmPromises.length > 0) {
        return Promise.all(rmPromises).then(function () {
          var spliceIndexLow = _this3._handleAddedSplices(repeat, array, splices);
          (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), spliceIndexLow);
        });
      }

      var spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
      (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), spliceIndexLow);

      return undefined;
    };

    ArrayRepeatStrategy.prototype._handleAddedSplices = function _handleAddedSplices(repeat, array, splices) {
      var spliceIndex = void 0;
      var spliceIndexLow = void 0;
      var arrayLength = array.length;
      for (var i = 0, ii = splices.length; i < ii; ++i) {
        var splice = splices[i];
        var addIndex = spliceIndex = splice.index;
        var end = splice.index + splice.addedCount;

        if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
          spliceIndexLow = spliceIndex;
        }

        for (; addIndex < end; ++addIndex) {
          var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, array[addIndex], addIndex, arrayLength);
          repeat.insertView(addIndex, overrideContext.bindingContext, overrideContext);
        }
      }

      return spliceIndexLow;
    };

    return ArrayRepeatStrategy;
  }();
});
define('aurelia-templating-resources/repeat-utilities',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.updateOverrideContexts = updateOverrideContexts;
  exports.createFullOverrideContext = createFullOverrideContext;
  exports.updateOverrideContext = updateOverrideContext;
  exports.getItemsSourceExpression = getItemsSourceExpression;
  exports.unwrapExpression = unwrapExpression;
  exports.isOneTime = isOneTime;
  exports.updateOneTimeBinding = updateOneTimeBinding;
  exports.indexOf = indexOf;


  var oneTime = _aureliaBinding.bindingMode.oneTime;

  function updateOverrideContexts(views, startIndex) {
    var length = views.length;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    for (; startIndex < length; ++startIndex) {
      updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
    }
  }

  function createFullOverrideContext(repeat, data, index, length, key) {
    var bindingContext = {};
    var overrideContext = (0, _aureliaBinding.createOverrideContext)(bindingContext, repeat.scope.overrideContext);

    if (typeof key !== 'undefined') {
      bindingContext[repeat.key] = key;
      bindingContext[repeat.value] = data;
    } else {
      bindingContext[repeat.local] = data;
    }
    updateOverrideContext(overrideContext, index, length);
    return overrideContext;
  }

  function updateOverrideContext(overrideContext, index, length) {
    var first = index === 0;
    var last = index === length - 1;
    var even = index % 2 === 0;

    overrideContext.$index = index;
    overrideContext.$first = first;
    overrideContext.$last = last;
    overrideContext.$middle = !(first || last);
    overrideContext.$odd = !even;
    overrideContext.$even = even;
  }

  function getItemsSourceExpression(instruction, attrName) {
    return instruction.behaviorInstructions.filter(function (bi) {
      return bi.originalAttrName === attrName;
    })[0].attributes.items.sourceExpression;
  }

  function unwrapExpression(expression) {
    var unwrapped = false;
    while (expression instanceof _aureliaBinding.BindingBehavior) {
      expression = expression.expression;
    }
    while (expression instanceof _aureliaBinding.ValueConverter) {
      expression = expression.expression;
      unwrapped = true;
    }
    return unwrapped ? expression : null;
  }

  function isOneTime(expression) {
    while (expression instanceof _aureliaBinding.BindingBehavior) {
      if (expression.name === 'oneTime') {
        return true;
      }
      expression = expression.expression;
    }
    return false;
  }

  function updateOneTimeBinding(binding) {
    if (binding.call && binding.mode === oneTime) {
      binding.call(_aureliaBinding.sourceContext);
    } else if (binding.updateOneTimeBindings) {
      binding.updateOneTimeBindings();
    }
  }

  function indexOf(array, item, matcher, startIndex) {
    if (!matcher) {
      return array.indexOf(item);
    }
    var length = array.length;
    for (var index = startIndex || 0; index < length; index++) {
      if (matcher(array[index], item)) {
        return index;
      }
    }
    return -1;
  }
});
define('aurelia-templating-resources/map-repeat-strategy',['exports', './repeat-utilities'], function (exports, _repeatUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MapRepeatStrategy = undefined;

  

  var MapRepeatStrategy = exports.MapRepeatStrategy = function () {
    function MapRepeatStrategy() {
      
    }

    MapRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getMapObserver(items);
    };

    MapRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, items);
        });
        return;
      }
      this._standardProcessItems(repeat, items);
    };

    MapRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, items) {
      var index = 0;
      var overrideContext = void 0;

      items.forEach(function (value, key) {
        overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, value, index, items.size, key);
        repeat.addView(overrideContext.bindingContext, overrideContext);
        ++index;
      });
    };

    MapRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, map, records) {
      var key = void 0;
      var i = void 0;
      var ii = void 0;
      var overrideContext = void 0;
      var removeIndex = void 0;
      var record = void 0;
      var rmPromises = [];
      var viewOrPromise = void 0;

      for (i = 0, ii = records.length; i < ii; ++i) {
        record = records[i];
        key = record.key;
        switch (record.type) {
          case 'update':
            removeIndex = this._getViewIndexByKey(repeat, key);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, map.get(key), removeIndex, map.size, key);
            repeat.insertView(removeIndex, overrideContext.bindingContext, overrideContext);
            break;
          case 'add':
            overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, map.get(key), map.size - 1, map.size, key);
            repeat.insertView(map.size - 1, overrideContext.bindingContext, overrideContext);
            break;
          case 'delete':
            if (record.oldValue === undefined) {
              return;
            }
            removeIndex = this._getViewIndexByKey(repeat, key);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            break;
          case 'clear':
            repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            break;
          default:
            continue;
        }
      }

      if (rmPromises.length > 0) {
        Promise.all(rmPromises).then(function () {
          (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
        });
      } else {
        (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
      }
    };

    MapRepeatStrategy.prototype._getViewIndexByKey = function _getViewIndexByKey(repeat, key) {
      var i = void 0;
      var ii = void 0;
      var child = void 0;

      for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
        child = repeat.view(i);
        if (child.bindingContext[repeat.key] === key) {
          return i;
        }
      }

      return undefined;
    };

    return MapRepeatStrategy;
  }();
});
define('aurelia-templating-resources/set-repeat-strategy',['exports', './repeat-utilities'], function (exports, _repeatUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SetRepeatStrategy = undefined;

  

  var SetRepeatStrategy = exports.SetRepeatStrategy = function () {
    function SetRepeatStrategy() {
      
    }

    SetRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getSetObserver(items);
    };

    SetRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, items);
        });
        return;
      }
      this._standardProcessItems(repeat, items);
    };

    SetRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, items) {
      var index = 0;
      var overrideContext = void 0;

      items.forEach(function (value) {
        overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, value, index, items.size);
        repeat.addView(overrideContext.bindingContext, overrideContext);
        ++index;
      });
    };

    SetRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, set, records) {
      var value = void 0;
      var i = void 0;
      var ii = void 0;
      var overrideContext = void 0;
      var removeIndex = void 0;
      var record = void 0;
      var rmPromises = [];
      var viewOrPromise = void 0;

      for (i = 0, ii = records.length; i < ii; ++i) {
        record = records[i];
        value = record.value;
        switch (record.type) {
          case 'add':
            overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, value, set.size - 1, set.size);
            repeat.insertView(set.size - 1, overrideContext.bindingContext, overrideContext);
            break;
          case 'delete':
            removeIndex = this._getViewIndexByValue(repeat, value);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            break;
          case 'clear':
            repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            break;
          default:
            continue;
        }
      }

      if (rmPromises.length > 0) {
        Promise.all(rmPromises).then(function () {
          (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
        });
      } else {
        (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
      }
    };

    SetRepeatStrategy.prototype._getViewIndexByValue = function _getViewIndexByValue(repeat, value) {
      var i = void 0;
      var ii = void 0;
      var child = void 0;

      for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
        child = repeat.view(i);
        if (child.bindingContext[repeat.local] === value) {
          return i;
        }
      }

      return undefined;
    };

    return SetRepeatStrategy;
  }();
});
define('aurelia-templating-resources/number-repeat-strategy',['exports', './repeat-utilities'], function (exports, _repeatUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NumberRepeatStrategy = undefined;

  

  var NumberRepeatStrategy = exports.NumberRepeatStrategy = function () {
    function NumberRepeatStrategy() {
      
    }

    NumberRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver() {
      return null;
    };

    NumberRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, value) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, value);
        });
        return;
      }
      this._standardProcessItems(repeat, value);
    };

    NumberRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, value) {
      var childrenLength = repeat.viewCount();
      var i = void 0;
      var ii = void 0;
      var overrideContext = void 0;
      var viewsToRemove = void 0;

      value = Math.floor(value);
      viewsToRemove = childrenLength - value;

      if (viewsToRemove > 0) {
        if (viewsToRemove > childrenLength) {
          viewsToRemove = childrenLength;
        }

        for (i = 0, ii = viewsToRemove; i < ii; ++i) {
          repeat.removeView(childrenLength - (i + 1), true, !repeat.viewsRequireLifecycle);
        }

        return;
      }

      for (i = childrenLength, ii = value; i < ii; ++i) {
        overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, i, i, ii);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }

      (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
    };

    return NumberRepeatStrategy;
  }();
});
define('aurelia-templating-resources/analyze-view-factory',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.viewsRequireLifecycle = viewsRequireLifecycle;
  var lifecycleOptionalBehaviors = exports.lifecycleOptionalBehaviors = ['focus', 'if', 'repeat', 'show', 'with'];

  function behaviorRequiresLifecycle(instruction) {
    var t = instruction.type;
    var name = t.elementName !== null ? t.elementName : t.attributeName;
    return lifecycleOptionalBehaviors.indexOf(name) === -1 && (t.handlesAttached || t.handlesBind || t.handlesCreated || t.handlesDetached || t.handlesUnbind) || t.viewFactory && viewsRequireLifecycle(t.viewFactory) || instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
  }

  function targetRequiresLifecycle(instruction) {
    var behaviors = instruction.behaviorInstructions;
    if (behaviors) {
      var i = behaviors.length;
      while (i--) {
        if (behaviorRequiresLifecycle(behaviors[i])) {
          return true;
        }
      }
    }

    return instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
  }

  function viewsRequireLifecycle(viewFactory) {
    if ('_viewsRequireLifecycle' in viewFactory) {
      return viewFactory._viewsRequireLifecycle;
    }

    viewFactory._viewsRequireLifecycle = false;

    if (viewFactory.viewFactory) {
      viewFactory._viewsRequireLifecycle = viewsRequireLifecycle(viewFactory.viewFactory);
      return viewFactory._viewsRequireLifecycle;
    }

    if (viewFactory.template.querySelector('.au-animate')) {
      viewFactory._viewsRequireLifecycle = true;
      return true;
    }

    for (var id in viewFactory.instructions) {
      if (targetRequiresLifecycle(viewFactory.instructions[id])) {
        viewFactory._viewsRequireLifecycle = true;
        return true;
      }
    }

    viewFactory._viewsRequireLifecycle = false;
    return false;
  }
});
define('aurelia-templating-resources/abstract-repeater',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var AbstractRepeater = exports.AbstractRepeater = function () {
    function AbstractRepeater(options) {
      

      Object.assign(this, {
        local: 'items',
        viewsRequireLifecycle: true
      }, options);
    }

    AbstractRepeater.prototype.viewCount = function viewCount() {
      throw new Error('subclass must implement `viewCount`');
    };

    AbstractRepeater.prototype.views = function views() {
      throw new Error('subclass must implement `views`');
    };

    AbstractRepeater.prototype.view = function view(index) {
      throw new Error('subclass must implement `view`');
    };

    AbstractRepeater.prototype.matcher = function matcher() {
      throw new Error('subclass must implement `matcher`');
    };

    AbstractRepeater.prototype.addView = function addView(bindingContext, overrideContext) {
      throw new Error('subclass must implement `addView`');
    };

    AbstractRepeater.prototype.insertView = function insertView(index, bindingContext, overrideContext) {
      throw new Error('subclass must implement `insertView`');
    };

    AbstractRepeater.prototype.moveView = function moveView(sourceIndex, targetIndex) {
      throw new Error('subclass must implement `moveView`');
    };

    AbstractRepeater.prototype.removeAllViews = function removeAllViews(returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeAllViews`');
    };

    AbstractRepeater.prototype.removeViews = function removeViews(viewsToRemove, returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeView`');
    };

    AbstractRepeater.prototype.removeView = function removeView(index, returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeView`');
    };

    AbstractRepeater.prototype.updateBindings = function updateBindings(view) {
      throw new Error('subclass must implement `updateBindings`');
    };

    return AbstractRepeater;
  }();
});
define('aurelia-templating-resources/show',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal', './aurelia-hide-style'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaPal, _aureliaHideStyle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Show = undefined;

  

  var _dec, _dec2, _class;

  var Show = exports.Show = (_dec = (0, _aureliaTemplating.customAttribute)('show'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.Animator, _aureliaDependencyInjection.Optional.of(_aureliaPal.DOM.boundary, true)), _dec(_class = _dec2(_class = function () {
    function Show(element, animator, domBoundary) {
      

      this.element = element;
      this.animator = animator;
      this.domBoundary = domBoundary;
    }

    Show.prototype.created = function created() {
      (0, _aureliaHideStyle.injectAureliaHideStyleAtBoundary)(this.domBoundary);
    };

    Show.prototype.valueChanged = function valueChanged(newValue) {
      if (newValue) {
        this.animator.removeClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      } else {
        this.animator.addClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      }
    };

    Show.prototype.bind = function bind(bindingContext) {
      this.valueChanged(this.value);
    };

    return Show;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/aurelia-hide-style',['exports', 'aurelia-pal'], function (exports, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.aureliaHideClassName = undefined;
  exports.injectAureliaHideStyleAtHead = injectAureliaHideStyleAtHead;
  exports.injectAureliaHideStyleAtBoundary = injectAureliaHideStyleAtBoundary;
  var aureliaHideClassName = exports.aureliaHideClassName = 'aurelia-hide';

  var aureliaHideClass = '.' + aureliaHideClassName + ' { display:none !important; }';

  function injectAureliaHideStyleAtHead() {
    _aureliaPal.DOM.injectStyles(aureliaHideClass);
  }

  function injectAureliaHideStyleAtBoundary(domBoundary) {
    if (_aureliaPal.FEATURE.shadowDOM && domBoundary && !domBoundary.hasAureliaHideStyle) {
      domBoundary.hasAureliaHideStyle = true;
      _aureliaPal.DOM.injectStyles(aureliaHideClass, domBoundary);
    }
  }
});
define('aurelia-templating-resources/hide',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal', './aurelia-hide-style'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaPal, _aureliaHideStyle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Hide = undefined;

  

  var _dec, _dec2, _class;

  var Hide = exports.Hide = (_dec = (0, _aureliaTemplating.customAttribute)('hide'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.Animator, _aureliaDependencyInjection.Optional.of(_aureliaPal.DOM.boundary, true)), _dec(_class = _dec2(_class = function () {
    function Hide(element, animator, domBoundary) {
      

      this.element = element;
      this.animator = animator;
      this.domBoundary = domBoundary;
    }

    Hide.prototype.created = function created() {
      (0, _aureliaHideStyle.injectAureliaHideStyleAtBoundary)(this.domBoundary);
    };

    Hide.prototype.valueChanged = function valueChanged(newValue) {
      if (newValue) {
        this.animator.addClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      } else {
        this.animator.removeClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      }
    };

    Hide.prototype.bind = function bind(bindingContext) {
      this.valueChanged(this.value);
    };

    return Hide;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/sanitize-html',['exports', 'aurelia-binding', 'aurelia-dependency-injection', './html-sanitizer'], function (exports, _aureliaBinding, _aureliaDependencyInjection, _htmlSanitizer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SanitizeHTMLValueConverter = undefined;

  

  var _dec, _dec2, _class;

  var SanitizeHTMLValueConverter = exports.SanitizeHTMLValueConverter = (_dec = (0, _aureliaBinding.valueConverter)('sanitizeHTML'), _dec2 = (0, _aureliaDependencyInjection.inject)(_htmlSanitizer.HTMLSanitizer), _dec(_class = _dec2(_class = function () {
    function SanitizeHTMLValueConverter(sanitizer) {
      

      this.sanitizer = sanitizer;
    }

    SanitizeHTMLValueConverter.prototype.toView = function toView(untrustedMarkup) {
      if (untrustedMarkup === null || untrustedMarkup === undefined) {
        return null;
      }

      return this.sanitizer.sanitize(untrustedMarkup);
    };

    return SanitizeHTMLValueConverter;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/html-sanitizer',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

  var HTMLSanitizer = exports.HTMLSanitizer = function () {
    function HTMLSanitizer() {
      
    }

    HTMLSanitizer.prototype.sanitize = function sanitize(input) {
      return input.replace(SCRIPT_REGEX, '');
    };

    return HTMLSanitizer;
  }();
});
define('aurelia-templating-resources/replaceable',['exports', 'aurelia-dependency-injection', 'aurelia-templating'], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Replaceable = undefined;

  

  var _dec, _dec2, _class;

  var Replaceable = exports.Replaceable = (_dec = (0, _aureliaTemplating.customAttribute)('replaceable'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
    function Replaceable(viewFactory, viewSlot) {
      

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.view = null;
    }

    Replaceable.prototype.bind = function bind(bindingContext, overrideContext) {
      if (this.view === null) {
        this.view = this.viewFactory.create();
        this.viewSlot.add(this.view);
      }

      this.view.bind(bindingContext, overrideContext);
    };

    Replaceable.prototype.unbind = function unbind() {
      this.view.unbind();
    };

    return Replaceable;
  }()) || _class) || _class) || _class);
});
define('aurelia-templating-resources/focus',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-pal'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _aureliaTaskQueue, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Focus = undefined;

  

  var _dec, _dec2, _class;

  var Focus = exports.Focus = (_dec = (0, _aureliaTemplating.customAttribute)('focus', _aureliaBinding.bindingMode.twoWay), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTaskQueue.TaskQueue), _dec(_class = _dec2(_class = function () {
    function Focus(element, taskQueue) {
      var _this = this;

      

      this.element = element;
      this.taskQueue = taskQueue;
      this.isAttached = false;
      this.needsApply = false;

      this.focusListener = function (e) {
        _this.value = true;
      };
      this.blurListener = function (e) {
        if (_aureliaPal.DOM.activeElement !== _this.element) {
          _this.value = false;
        }
      };
    }

    Focus.prototype.valueChanged = function valueChanged(newValue) {
      if (this.isAttached) {
        this._apply();
      } else {
        this.needsApply = true;
      }
    };

    Focus.prototype._apply = function _apply() {
      var _this2 = this;

      if (this.value) {
        this.taskQueue.queueMicroTask(function () {
          if (_this2.value) {
            _this2.element.focus();
          }
        });
      } else {
        this.element.blur();
      }
    };

    Focus.prototype.attached = function attached() {
      this.isAttached = true;
      if (this.needsApply) {
        this.needsApply = false;
        this._apply();
      }
      this.element.addEventListener('focus', this.focusListener);
      this.element.addEventListener('blur', this.blurListener);
    };

    Focus.prototype.detached = function detached() {
      this.isAttached = false;
      this.element.removeEventListener('focus', this.focusListener);
      this.element.removeEventListener('blur', this.blurListener);
    };

    return Focus;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/css-resource',['exports', 'aurelia-templating', 'aurelia-loader', 'aurelia-dependency-injection', 'aurelia-path', 'aurelia-pal'], function (exports, _aureliaTemplating, _aureliaLoader, _aureliaDependencyInjection, _aureliaPath, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports._createCSSResource = _createCSSResource;

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  

  var cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;

  function fixupCSSUrls(address, css) {
    if (typeof css !== 'string') {
      throw new Error('Failed loading required CSS file: ' + address);
    }
    return css.replace(cssUrlMatcher, function (match, p1) {
      var quote = p1.charAt(0);
      if (quote === '\'' || quote === '"') {
        p1 = p1.substr(1, p1.length - 2);
      }
      return 'url(\'' + (0, _aureliaPath.relativeToFile)(p1, address) + '\')';
    });
  }

  var CSSResource = function () {
    function CSSResource(address) {
      

      this.address = address;
      this._scoped = null;
      this._global = false;
      this._alreadyGloballyInjected = false;
    }

    CSSResource.prototype.initialize = function initialize(container, target) {
      this._scoped = new target(this);
    };

    CSSResource.prototype.register = function register(registry, name) {
      if (name === 'scoped') {
        registry.registerViewEngineHooks(this._scoped);
      } else {
        this._global = true;
      }
    };

    CSSResource.prototype.load = function load(container) {
      var _this = this;

      return container.get(_aureliaLoader.Loader).loadText(this.address).catch(function (err) {
        return null;
      }).then(function (text) {
        text = fixupCSSUrls(_this.address, text);
        _this._scoped.css = text;
        if (_this._global) {
          _this._alreadyGloballyInjected = true;
          _aureliaPal.DOM.injectStyles(text);
        }
      });
    };

    return CSSResource;
  }();

  var CSSViewEngineHooks = function () {
    function CSSViewEngineHooks(owner) {
      

      this.owner = owner;
      this.css = null;
    }

    CSSViewEngineHooks.prototype.beforeCompile = function beforeCompile(content, resources, instruction) {
      if (instruction.targetShadowDOM) {
        _aureliaPal.DOM.injectStyles(this.css, content, true);
      } else if (_aureliaPal.FEATURE.scopedCSS) {
        var styleNode = _aureliaPal.DOM.injectStyles(this.css, content, true);
        styleNode.setAttribute('scoped', 'scoped');
      } else if (!this.owner._alreadyGloballyInjected) {
        _aureliaPal.DOM.injectStyles(this.css);
        this.owner._alreadyGloballyInjected = true;
      }
    };

    return CSSViewEngineHooks;
  }();

  function _createCSSResource(address) {
    var _dec, _class;

    var ViewCSS = (_dec = (0, _aureliaTemplating.resource)(new CSSResource(address)), _dec(_class = function (_CSSViewEngineHooks) {
      _inherits(ViewCSS, _CSSViewEngineHooks);

      function ViewCSS() {
        

        return _possibleConstructorReturn(this, _CSSViewEngineHooks.apply(this, arguments));
      }

      return ViewCSS;
    }(CSSViewEngineHooks)) || _class);

    return ViewCSS;
  }
});
define('aurelia-templating-resources/attr-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AttrBindingBehavior = undefined;

  

  var AttrBindingBehavior = exports.AttrBindingBehavior = function () {
    function AttrBindingBehavior() {
      
    }

    AttrBindingBehavior.prototype.bind = function bind(binding, source) {
      binding.targetObserver = new _aureliaBinding.DataAttributeObserver(binding.target, binding.targetProperty);
    };

    AttrBindingBehavior.prototype.unbind = function unbind(binding, source) {};

    return AttrBindingBehavior;
  }();
});
define('aurelia-templating-resources/binding-mode-behaviors',['exports', 'aurelia-binding', 'aurelia-metadata'], function (exports, _aureliaBinding, _aureliaMetadata) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TwoWayBindingBehavior = exports.OneWayBindingBehavior = exports.OneTimeBindingBehavior = undefined;

  

  var _dec, _class, _dec2, _class2, _dec3, _class3;

  var modeBindingBehavior = {
    bind: function bind(binding, source, lookupFunctions) {
      binding.originalMode = binding.mode;
      binding.mode = this.mode;
    },
    unbind: function unbind(binding, source) {
      binding.mode = binding.originalMode;
      binding.originalMode = null;
    }
  };

  var OneTimeBindingBehavior = exports.OneTimeBindingBehavior = (_dec = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec(_class = function OneTimeBindingBehavior() {
    

    this.mode = _aureliaBinding.bindingMode.oneTime;
  }) || _class);
  var OneWayBindingBehavior = exports.OneWayBindingBehavior = (_dec2 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec2(_class2 = function OneWayBindingBehavior() {
    

    this.mode = _aureliaBinding.bindingMode.oneWay;
  }) || _class2);
  var TwoWayBindingBehavior = exports.TwoWayBindingBehavior = (_dec3 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec3(_class3 = function TwoWayBindingBehavior() {
    

    this.mode = _aureliaBinding.bindingMode.twoWay;
  }) || _class3);
});
define('aurelia-templating-resources/throttle-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ThrottleBindingBehavior = undefined;

  

  function throttle(newValue) {
    var _this = this;

    var state = this.throttleState;
    var elapsed = +new Date() - state.last;
    if (elapsed >= state.delay) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
      state.last = +new Date();
      this.throttledMethod(newValue);
      return;
    }
    state.newValue = newValue;
    if (state.timeoutId === null) {
      state.timeoutId = setTimeout(function () {
        state.timeoutId = null;
        state.last = +new Date();
        _this.throttledMethod(state.newValue);
      }, state.delay - elapsed);
    }
  }

  var ThrottleBindingBehavior = exports.ThrottleBindingBehavior = function () {
    function ThrottleBindingBehavior() {
      
    }

    ThrottleBindingBehavior.prototype.bind = function bind(binding, source) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;

      var methodToThrottle = 'updateTarget';
      if (binding.callSource) {
        methodToThrottle = 'callSource';
      } else if (binding.updateSource && binding.mode === _aureliaBinding.bindingMode.twoWay) {
        methodToThrottle = 'updateSource';
      }

      binding.throttledMethod = binding[methodToThrottle];
      binding.throttledMethod.originalName = methodToThrottle;

      binding[methodToThrottle] = throttle;

      binding.throttleState = {
        delay: delay,
        last: 0,
        timeoutId: null
      };
    };

    ThrottleBindingBehavior.prototype.unbind = function unbind(binding, source) {
      var methodToRestore = binding.throttledMethod.originalName;
      binding[methodToRestore] = binding.throttledMethod;
      binding.throttledMethod = null;
      clearTimeout(binding.throttleState.timeoutId);
      binding.throttleState = null;
    };

    return ThrottleBindingBehavior;
  }();
});
define('aurelia-templating-resources/debounce-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DebounceBindingBehavior = undefined;

  

  function debounce(newValue) {
    var _this = this;

    var state = this.debounceState;
    if (state.immediate) {
      state.immediate = false;
      this.debouncedMethod(newValue);
      return;
    }
    clearTimeout(state.timeoutId);
    state.timeoutId = setTimeout(function () {
      return _this.debouncedMethod(newValue);
    }, state.delay);
  }

  var DebounceBindingBehavior = exports.DebounceBindingBehavior = function () {
    function DebounceBindingBehavior() {
      
    }

    DebounceBindingBehavior.prototype.bind = function bind(binding, source) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;

      var methodToDebounce = 'updateTarget';
      if (binding.callSource) {
        methodToDebounce = 'callSource';
      } else if (binding.updateSource && binding.mode === _aureliaBinding.bindingMode.twoWay) {
        methodToDebounce = 'updateSource';
      }

      binding.debouncedMethod = binding[methodToDebounce];
      binding.debouncedMethod.originalName = methodToDebounce;

      binding[methodToDebounce] = debounce;

      binding.debounceState = {
        delay: delay,
        timeoutId: null,
        immediate: methodToDebounce === 'updateTarget' };
    };

    DebounceBindingBehavior.prototype.unbind = function unbind(binding, source) {
      var methodToRestore = binding.debouncedMethod.originalName;
      binding[methodToRestore] = binding.debouncedMethod;
      binding.debouncedMethod = null;
      clearTimeout(binding.debounceState.timeoutId);
      binding.debounceState = null;
    };

    return DebounceBindingBehavior;
  }();
});
define('aurelia-templating-resources/signal-binding-behavior',['exports', './binding-signaler'], function (exports, _bindingSignaler) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SignalBindingBehavior = undefined;

  

  var SignalBindingBehavior = exports.SignalBindingBehavior = function () {
    SignalBindingBehavior.inject = function inject() {
      return [_bindingSignaler.BindingSignaler];
    };

    function SignalBindingBehavior(bindingSignaler) {
      

      this.signals = bindingSignaler.signals;
    }

    SignalBindingBehavior.prototype.bind = function bind(binding, source) {
      if (!binding.updateTarget) {
        throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
      }
      if (arguments.length === 3) {
        var name = arguments[2];
        var bindings = this.signals[name] || (this.signals[name] = []);
        bindings.push(binding);
        binding.signalName = name;
      } else if (arguments.length > 3) {
        var names = Array.prototype.slice.call(arguments, 2);
        var i = names.length;
        while (i--) {
          var _name = names[i];
          var _bindings = this.signals[_name] || (this.signals[_name] = []);
          _bindings.push(binding);
        }
        binding.signalName = names;
      } else {
        throw new Error('Signal name is required.');
      }
    };

    SignalBindingBehavior.prototype.unbind = function unbind(binding, source) {
      var name = binding.signalName;
      binding.signalName = null;
      if (Array.isArray(name)) {
        var names = name;
        var i = names.length;
        while (i--) {
          var n = names[i];
          var bindings = this.signals[n];
          bindings.splice(bindings.indexOf(binding), 1);
        }
      } else {
        var _bindings2 = this.signals[name];
        _bindings2.splice(_bindings2.indexOf(binding), 1);
      }
    };

    return SignalBindingBehavior;
  }();
});
define('aurelia-templating-resources/binding-signaler',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BindingSignaler = undefined;

  

  var BindingSignaler = exports.BindingSignaler = function () {
    function BindingSignaler() {
      

      this.signals = {};
    }

    BindingSignaler.prototype.signal = function signal(name) {
      var bindings = this.signals[name];
      if (!bindings) {
        return;
      }
      var i = bindings.length;
      while (i--) {
        bindings[i].call(_aureliaBinding.sourceContext);
      }
    };

    return BindingSignaler;
  }();
});
define('aurelia-templating-resources/update-trigger-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UpdateTriggerBindingBehavior = undefined;

  

  var _class, _temp;

  var eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
  var notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way bindings on input/select elements.';

  var UpdateTriggerBindingBehavior = exports.UpdateTriggerBindingBehavior = (_temp = _class = function () {
    function UpdateTriggerBindingBehavior(eventManager) {
      

      this.eventManager = eventManager;
    }

    UpdateTriggerBindingBehavior.prototype.bind = function bind(binding, source) {
      for (var _len = arguments.length, events = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        events[_key - 2] = arguments[_key];
      }

      if (events.length === 0) {
        throw new Error(eventNamesRequired);
      }
      if (binding.mode !== _aureliaBinding.bindingMode.twoWay) {
        throw new Error(notApplicableMessage);
      }

      var targetObserver = binding.observerLocator.getObserver(binding.target, binding.targetProperty);
      if (!targetObserver.handler) {
        throw new Error(notApplicableMessage);
      }
      binding.targetObserver = targetObserver;

      targetObserver.originalHandler = binding.targetObserver.handler;

      var handler = this.eventManager.createElementHandler(events);
      targetObserver.handler = handler;
    };

    UpdateTriggerBindingBehavior.prototype.unbind = function unbind(binding, source) {
      binding.targetObserver.handler = binding.targetObserver.originalHandler;
      binding.targetObserver.originalHandler = null;
    };

    return UpdateTriggerBindingBehavior;
  }(), _class.inject = [_aureliaBinding.EventManager], _temp);
});
define('aurelia-templating-resources/html-resource-plugin',['exports', 'aurelia-templating', './dynamic-element'], function (exports, _aureliaTemplating, _dynamicElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getElementName = getElementName;
  exports.configure = configure;
  function getElementName(address) {
    return (/([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase()
    );
  }

  function configure(config) {
    var viewEngine = config.container.get(_aureliaTemplating.ViewEngine);
    var loader = config.aurelia.loader;

    viewEngine.addResourcePlugin('.html', {
      'fetch': function fetch(address) {
        return loader.loadTemplate(address).then(function (registryEntry) {
          var _ref;

          var bindable = registryEntry.template.getAttribute('bindable');
          var elementName = getElementName(address);

          if (bindable) {
            bindable = bindable.split(',').map(function (x) {
              return x.trim();
            });
            registryEntry.template.removeAttribute('bindable');
          } else {
            bindable = [];
          }

          return _ref = {}, _ref[elementName] = (0, _dynamicElement._createDynamicElement)(elementName, address, bindable), _ref;
        });
      }
    });
  }
});
define('aurelia-templating-resources/dynamic-element',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports._createDynamicElement = _createDynamicElement;

  

  function _createDynamicElement(name, viewUrl, bindableNames) {
    var _dec, _dec2, _class;

    var DynamicElement = (_dec = (0, _aureliaTemplating.customElement)(name), _dec2 = (0, _aureliaTemplating.useView)(viewUrl), _dec(_class = _dec2(_class = function () {
      function DynamicElement() {
        
      }

      DynamicElement.prototype.bind = function bind(bindingContext) {
        this.$parent = bindingContext;
      };

      return DynamicElement;
    }()) || _class) || _class);

    for (var i = 0, ii = bindableNames.length; i < ii; ++i) {
      (0, _aureliaTemplating.bindable)(bindableNames[i])(DynamicElement);
    }
    return DynamicElement;
  }
});
define('aurelia-i18n/i18n',['exports', 'i18next', 'aurelia-pal', 'aurelia-event-aggregator', 'aurelia-templating-resources'], function (exports, _i18next, _aureliaPal, _aureliaEventAggregator, _aureliaTemplatingResources) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.I18N = undefined;

  var _i18next2 = _interopRequireDefault(_i18next);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  

  var _class, _temp;

  var I18N = exports.I18N = (_temp = _class = function () {
    function I18N(ea, signaler) {
      var _this = this;

      

      this.globalVars = {};
      this.params = {};
      this.i18nextDefered = {
        resolve: null,
        promise: null
      };

      this.i18next = _i18next2.default;
      this.ea = ea;
      this.Intl = window.Intl;
      this.signaler = signaler;
      this.i18nextDefered.promise = new Promise(function (resolve) {
        return _this.i18nextDefered.resolve = resolve;
      });
    }

    I18N.prototype.setup = function setup(options) {
      var _this2 = this;

      var defaultOptions = {
        compatibilityAPI: 'v1',
        compatibilityJSON: 'v1',
        lng: 'en',
        attributes: ['t', 'i18n'],
        fallbackLng: 'en',
        debug: false
      };

      _i18next2.default.init(options || defaultOptions, function (err, t) {
        if (_i18next2.default.options.attributes instanceof String) {
          _i18next2.default.options.attributes = [_i18next2.default.options.attributes];
        }

        _this2.i18nextDefered.resolve(_this2.i18next);
      });

      return this.i18nextDefered.promise;
    };

    I18N.prototype.i18nextReady = function i18nextReady() {
      return this.i18nextDefered.promise;
    };

    I18N.prototype.setLocale = function setLocale(locale) {
      var _this3 = this;

      return new Promise(function (resolve) {
        var oldLocale = _this3.getLocale();
        _this3.i18next.changeLanguage(locale, function (err, tr) {
          _this3.ea.publish('i18n:locale:changed', { oldValue: oldLocale, newValue: locale });
          _this3.signaler.signal('aurelia-translation-signal');
          resolve(tr);
        });
      });
    };

    I18N.prototype.getLocale = function getLocale() {
      return this.i18next.language;
    };

    I18N.prototype.nf = function nf(options, locales) {
      return new this.Intl.NumberFormat(locales || this.getLocale(), options || {});
    };

    I18N.prototype.uf = function uf(number, locale) {
      var nf = this.nf({}, locale || this.getLocale());
      var comparer = nf.format(10000 / 3);

      var thousandSeparator = comparer[1];
      var decimalSeparator = comparer[5];

      var result = number.replace(thousandSeparator, '').replace(/[^\d.,-]/g, '').replace(decimalSeparator, '.');

      return Number(result);
    };

    I18N.prototype.df = function df(options, locales) {
      return new this.Intl.DateTimeFormat(locales || this.getLocale(), options);
    };

    I18N.prototype.tr = function tr(key, options) {
      var fullOptions = this.globalVars;

      if (options !== undefined) {
        fullOptions = Object.assign(Object.assign({}, this.globalVars), options);
      }

      return this.i18next.t(key, fullOptions);
    };

    I18N.prototype.registerGlobalVariable = function registerGlobalVariable(key, value) {
      this.globalVars[key] = value;
    };

    I18N.prototype.unregisterGlobalVariable = function unregisterGlobalVariable(key) {
      delete this.globalVars[key];
    };

    I18N.prototype.updateTranslations = function updateTranslations(el) {
      if (!el || !el.querySelectorAll) {
        return;
      }

      var i = void 0;
      var l = void 0;

      var selector = [].concat(this.i18next.options.attributes);
      for (i = 0, l = selector.length; i < l; i++) {
        selector[i] = '[' + selector[i] + ']';
      }selector = selector.join(',');

      var nodes = el.querySelectorAll(selector);
      for (i = 0, l = nodes.length; i < l; i++) {
        var node = nodes[i];
        var keys = void 0;

        for (var i2 = 0, l2 = this.i18next.options.attributes.length; i2 < l2; i2++) {
          keys = node.getAttribute(this.i18next.options.attributes[i2]);
          if (keys) break;
        }

        if (!keys) continue;

        this.updateValue(node, keys);
      }
    };

    I18N.prototype.updateValue = function updateValue(node, value, params) {
      if (value === null || value === undefined) {
        return;
      }

      var keys = value.split(';');
      var i = keys.length;

      while (i--) {
        var key = keys[i];

        var re = /\[([a-z\-]*)\]/ig;

        var m = void 0;
        var attr = 'text';

        if (node.nodeName === 'IMG') attr = 'src';

        while ((m = re.exec(key)) !== null) {
          if (m.index === re.lastIndex) {
            re.lastIndex++;
          }
          if (m) {
            key = key.replace(m[0], '');
            attr = m[1];
          }
        }

        if (!node._textContent) node._textContent = node.textContent;
        if (!node._innerHTML) node._innerHTML = node.innerHTML;

        attr = attr.replace(/-([a-z])/g, function (g) {
          return g[1].toUpperCase();
        });

        switch (attr) {
          case 'text':
            var newChild = _aureliaPal.DOM.createTextNode(this.tr(key, params));
            if (node._newChild) {
              node.removeChild(node._newChild);
            }

            node._newChild = newChild;
            while (node.firstChild) {
              node.removeChild(node.firstChild);
            }
            node.appendChild(node._newChild);
            break;
          case 'prepend':
            var prependParser = _aureliaPal.DOM.createElement('div');
            prependParser.innerHTML = this.tr(key, params);
            for (var ni = node.childNodes.length - 1; ni >= 0; ni--) {
              if (node.childNodes[ni]._prepended) {
                node.removeChild(node.childNodes[ni]);
              }
            }

            for (var pi = prependParser.childNodes.length - 1; pi >= 0; pi--) {
              prependParser.childNodes[pi]._prepended = true;
              if (node.firstChild) {
                node.insertBefore(prependParser.childNodes[pi], node.firstChild);
              } else {
                node.appendChild(prependParser.childNodes[pi]);
              }
            }
            break;
          case 'append':
            var appendParser = _aureliaPal.DOM.createElement('div');
            appendParser.innerHTML = this.tr(key, params);
            for (var _ni = node.childNodes.length - 1; _ni >= 0; _ni--) {
              if (node.childNodes[_ni]._appended) {
                node.removeChild(node.childNodes[_ni]);
              }
            }

            while (appendParser.firstChild) {
              appendParser.firstChild._appended = true;
              node.appendChild(appendParser.firstChild);
            }
            break;
          case 'html':
            node.innerHTML = this.tr(key, params);
            break;
          default:
            if (node.au && node.au.controller && node.au.controller.viewModel && node.au.controller.viewModel[attr]) {
              node.au.controller.viewModel[attr] = this.tr(key, params);
            } else {
              node.setAttribute(attr, this.tr(key, params));
            }

            break;
        }
      }
    };

    return I18N;
  }(), _class.inject = [_aureliaEventAggregator.EventAggregator, _aureliaTemplatingResources.BindingSignaler], _temp);
});
define('aurelia-i18n/relativeTime',['exports', './i18n', './defaultTranslations/relative.time', 'aurelia-event-aggregator'], function (exports, _i18n, _relative, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RelativeTime = undefined;

  

  var RelativeTime = exports.RelativeTime = function () {
    RelativeTime.inject = function inject() {
      return [_i18n.I18N, _aureliaEventAggregator.EventAggregator];
    };

    function RelativeTime(i18n, ea) {
      var _this = this;

      

      this.service = i18n;
      this.ea = ea;

      this.service.i18nextReady().then(function () {
        _this.setup();
      });
      this.ea.subscribe('i18n:locale:changed', function (locales) {
        _this.setup(locales);
      });
    }

    RelativeTime.prototype.setup = function setup(locales) {
      var trans = _relative.translations.default || _relative.translations;
      var key = locales && locales.newValue ? locales.newValue : this.service.getLocale();
      var fallbackLng = this.service.i18next.fallbackLng;
      var index = 0;

      if ((index = key.indexOf('-')) >= 0) {
        var baseLocale = key.substring(0, index);

        if (trans[baseLocale]) {
          this.addTranslationResource(baseLocale, trans[baseLocale].translation);
        }
      }

      if (trans[key]) {
        this.addTranslationResource(key, trans[key].translation);
      }
      if (trans[fallbackLng]) {
        this.addTranslationResource(key, trans[fallbackLng].translation);
      }
    };

    RelativeTime.prototype.addTranslationResource = function addTranslationResource(key, translation) {
      var options = this.service.i18next.options;

      if (options.interpolation && options.interpolation.prefix !== '__' || options.interpolation.suffix !== '__') {
        for (var subkey in translation) {
          translation[subkey] = translation[subkey].replace('__count__', options.interpolation.prefix + 'count' + options.interpolation.suffix);
        }
      }

      this.service.i18next.addResources(key, options.defaultNS, translation);
    };

    RelativeTime.prototype.getRelativeTime = function getRelativeTime(time) {
      var now = new Date();
      var diff = now.getTime() - time.getTime();

      var timeDiff = this.getTimeDiffDescription(diff, 'year', 31104000000);
      if (!timeDiff) {
        timeDiff = this.getTimeDiffDescription(diff, 'month', 2592000000);
        if (!timeDiff) {
          timeDiff = this.getTimeDiffDescription(diff, 'day', 86400000);
          if (!timeDiff) {
            timeDiff = this.getTimeDiffDescription(diff, 'hour', 3600000);
            if (!timeDiff) {
              timeDiff = this.getTimeDiffDescription(diff, 'minute', 60000);
              if (!timeDiff) {
                timeDiff = this.getTimeDiffDescription(diff, 'second', 1000);
                if (!timeDiff) {
                  timeDiff = this.service.tr('now');
                }
              }
            }
          }
        }
      }

      return timeDiff;
    };

    RelativeTime.prototype.getTimeDiffDescription = function getTimeDiffDescription(diff, unit, timeDivisor) {
      var unitAmount = (diff / timeDivisor).toFixed(0);
      if (unitAmount > 0) {
        return this.service.tr(unit, { count: parseInt(unitAmount, 10), context: 'ago' });
      } else if (unitAmount < 0) {
        var abs = Math.abs(unitAmount);
        return this.service.tr(unit, { count: abs, context: 'in' });
      }

      return null;
    };

    return RelativeTime;
  }();
});
define('aurelia-i18n/defaultTranslations/relative.time',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var translations = exports.translations = {
    ar: {
      translation: {
        'now': 'الآن',
        'second_ago': 'منذ __count__ ثانية',
        'second_ago_plural': 'منذ __count__ ثواني',
        'second_in': 'في __count__ ثانية',
        'second_in_plural': 'في __count__ ثواني',
        'minute_ago': 'منذ __count__ دقيقة',
        'minute_ago_plural': 'منذ __count__ دقائق',
        'minute_in': 'في __count__ دقيقة',
        'minute_in_plural': 'في __count__ دقائق',
        'hour_ago': 'منذ __count__ ساعة',
        'hour_ago_plural': 'منذ __count__ ساعات',
        'hour_in': 'في __count__ ساعة',
        'hour_in_plural': 'في __count__ ساعات',
        'day_ago': 'منذ __count__ يوم',
        'day_ago_plural': 'منذ __count__ أيام',
        'day_in': 'في __count__ يوم',
        'day_in_plural': 'في __count__ أيام'
      }
    },
    en: {
      translation: {
        'now': 'just now',
        'second_ago': '__count__ second ago',
        'second_ago_plural': '__count__ seconds ago',
        'second_in': 'in __count__ second',
        'second_in_plural': 'in __count__ seconds',
        'minute_ago': '__count__ minute ago',
        'minute_ago_plural': '__count__ minutes ago',
        'minute_in': 'in __count__ minute',
        'minute_in_plural': 'in __count__ minutes',
        'hour_ago': '__count__ hour ago',
        'hour_ago_plural': '__count__ hours ago',
        'hour_in': 'in __count__ hour',
        'hour_in_plural': 'in __count__ hours',
        'day_ago': '__count__ day ago',
        'day_ago_plural': '__count__ days ago',
        'day_in': 'in __count__ day',
        'day_in_plural': 'in __count__ days',
        'month_ago': '__count__ month ago',
        'month_ago_plural': '__count__ months ago',
        'month_in': 'in __count__ month',
        'month_in_plural': 'in __count__ months',
        'year_ago': '__count__ year ago',
        'year_ago_plural': '__count__ years ago',
        'year_in': 'in __count__ year',
        'year_in_plural': 'in __count__ years'
      }
    },
    it: {
      translation: {
        'now': 'adesso',
        'second_ago': '__count__ secondo fa',
        'second_ago_plural': '__count__ secondi fa',
        'second_in': 'in __count__ secondo',
        'second_in_plural': 'in __count__ secondi',
        'minute_ago': '__count__ minuto fa',
        'minute_ago_plural': '__count__ minuti fa',
        'minute_in': 'in __count__ minuto',
        'minute_in_plural': 'in __count__ minuti',
        'hour_ago': '__count__ ora fa',
        'hour_ago_plural': '__count__ ore fa',
        'hour_in': 'in __count__ ora',
        'hour_in_plural': 'in __count__ ore',
        'day_ago': '__count__ giorno fa',
        'day_ago_plural': '__count__ giorni fa',
        'day_in': 'in __count__ giorno',
        'day_in_plural': 'in __count__ giorni',
        'month_ago': '__count__ mese fa',
        'month_ago_plural': '__count__ mesi fa',
        'month_in': 'in __count__ mese',
        'month_in_plural': 'in __count__ mesi',
        'year_ago': '__count__ anno fa',
        'year_ago_plural': '__count__ anni fa',
        'year_in': 'in __count__ anno',
        'year_in_plural': 'in __count__ anni'
      }
    },
    de: {
      translation: {
        'now': 'jetzt gerade',
        'second_ago': 'vor __count__ Sekunde',
        'second_ago_plural': 'vor __count__ Sekunden',
        'second_in': 'in __count__ Sekunde',
        'second_in_plural': 'in __count__ Sekunden',
        'minute_ago': 'vor __count__ Minute',
        'minute_ago_plural': 'vor __count__ Minuten',
        'minute_in': 'in __count__ Minute',
        'minute_in_plural': 'in __count__ Minuten',
        'hour_ago': 'vor __count__ Stunde',
        'hour_ago_plural': 'vor __count__ Stunden',
        'hour_in': 'in __count__ Stunde',
        'hour_in_plural': 'in __count__ Stunden',
        'day_ago': 'vor __count__ Tag',
        'day_ago_plural': 'vor __count__ Tagen',
        'day_in': 'in __count__ Tag',
        'day_in_plural': 'in __count__ Tagen',
        'month_ago': 'vor __count__ Monat',
        'month_ago_plural': 'vor __count__ Monaten',
        'month_in': 'in __count__ Monat',
        'month_in_plural': 'in __count__ Monaten',
        'year_ago': 'vor __count__ Jahr',
        'year_ago_plural': 'vor __count__ Jahren',
        'year_in': 'in __count__ Jahr',
        'year_in_plural': 'in __count__ Jahren'
      }
    },
    nl: {
      translation: {
        'now': 'zonet',
        'second_ago': '__count__ seconde geleden',
        'second_ago_plural': '__count__ seconden geleden',
        'second_in': 'in __count__ seconde',
        'second_in_plural': 'in __count__ seconden',
        'minute_ago': '__count__ minuut geleden',
        'minute_ago_plural': '__count__ minuten geleden',
        'minute_in': 'in __count__ minuut',
        'minute_in_plural': 'in __count__ minuten',
        'hour_ago': '__count__ uur geleden',
        'hour_ago_plural': '__count__ uren geleden',
        'hour_in': 'in __count__ uur',
        'hour_in_plural': 'in __count__ uren',
        'day_ago': '__count__ dag geleden',
        'day_ago_plural': '__count__ dagen geleden',
        'day_in': 'in __count__ dag',
        'day_in_plural': 'in __count__ dagen',
        'month_ago': '__count__ maand geleden',
        'month_ago_plural': '__count__ maanden geleden',
        'month_in': 'in __count__ maand',
        'month_in_plural': 'in __count__ maanden',
        'year_ago': '__count__ jaar geleden',
        'year_ago_plural': '__count__ jaren geleden',
        'year_in': 'in __count__ jaar',
        'year_in_plural': 'in __count__ jaren'
      }
    },
    fr: {
      translation: {
        'now': 'maintenant',
        'second_ago': '__count__ seconde plus tôt',
        'second_ago_plural': '__count__ secondes plus tôt',
        'second_in': 'en __count__ seconde',
        'second_in_plural': 'en __count__ secondes',
        'minute_ago': '__count__ minute plus tôt',
        'minute_ago_plural': '__count__ minutes plus tôt',
        'minute_in': 'en __count__ minute',
        'minute_in_plural': 'en __count__ minutes',
        'hour_ago': '__count__ heure plus tôt',
        'hour_ago_plural': '__count__ heures plus tôt',
        'hour_in': 'en __count__ heure',
        'hour_in_plural': 'en __count__ heures',
        'day_ago': '__count__ jour plus tôt',
        'day_ago_plural': '__count__ jours plus tôt',
        'day_in': 'en __count__ jour',
        'day_in_plural': 'en __count__ jours'
      }
    },
    th: {
      translation: {
        'now': 'เมื่อกี้',
        'second_ago': '__count__ วินาที ที่ผ่านมา',
        'second_ago_plural': '__count__ วินาที ที่ผ่านมา',
        'second_in': 'อีก __count__ วินาที',
        'second_in_plural': 'อีก __count__ วินาที',
        'minute_ago': '__count__ นาที ที่ผ่านมา',
        'minute_ago_plural': '__count__ นาที ที่ผ่านมา',
        'minute_in': 'อีก __count__ นาที',
        'minute_in_plural': 'อีก __count__ นาที',
        'hour_ago': '__count__ ชั่วโมง ที่ผ่านมา',
        'hour_ago_plural': '__count__ ชั่วโมง ที่ผ่านมา',
        'hour_in': 'อีก __count__ ชั่วโมง',
        'hour_in_plural': 'อีก __count__ ชั่วโมง',
        'day_ago': '__count__ วัน ที่ผ่านมา',
        'day_ago_plural': '__count__ วัน ที่ผ่านมา',
        'day_in': 'อีก __count__ วัน',
        'day_in_plural': 'อีก __count__ วัน'
      }
    },
    sv: {
      translation: {
        'now': 'just nu',
        'second_ago': '__count__ sekund sedan',
        'second_ago_plural': '__count__ sekunder sedan',
        'second_in': 'om __count__ sekund',
        'second_in_plural': 'om __count__ sekunder',
        'minute_ago': '__count__ minut sedan',
        'minute_ago_plural': '__count__ minuter sedan',
        'minute_in': 'om __count__ minut',
        'minute_in_plural': 'om __count__ minuter',
        'hour_ago': '__count__ timme sedan',
        'hour_ago_plural': '__count__ timmar sedan',
        'hour_in': 'om __count__ timme',
        'hour_in_plural': 'om __count__ timmar',
        'day_ago': '__count__ dag sedan',
        'day_ago_plural': '__count__ dagar sedan',
        'day_in': 'om __count__ dag',
        'day_in_plural': 'om __count__ dagar'
      }
    },
    da: {
      translation: {
        'now': 'lige nu',
        'second_ago': '__count__ sekunder siden',
        'second_ago_plural': '__count__ sekunder siden',
        'second_in': 'om __count__ sekund',
        'second_in_plural': 'om __count__ sekunder',
        'minute_ago': '__count__ minut siden',
        'minute_ago_plural': '__count__ minutter siden',
        'minute_in': 'om __count__ minut',
        'minute_in_plural': 'om __count__ minutter',
        'hour_ago': '__count__ time siden',
        'hour_ago_plural': '__count__ timer siden',
        'hour_in': 'om __count__ time',
        'hour_in_plural': 'om __count__ timer',
        'day_ago': '__count__ dag siden',
        'day_ago_plural': '__count__ dage siden',
        'day_in': 'om __count__ dag',
        'day_in_plural': 'om __count__ dage'
      }
    },
    no: {
      translation: {
        'now': 'akkurat nå',
        'second_ago': '__count__ sekund siden',
        'second_ago_plural': '__count__ sekunder siden',
        'second_in': 'om __count__ sekund',
        'second_in_plural': 'om __count__ sekunder',
        'minute_ago': '__count__ minutt siden',
        'minute_ago_plural': '__count__ minutter siden',
        'minute_in': 'om __count__ minutt',
        'minute_in_plural': 'om __count__ minutter',
        'hour_ago': '__count__ time siden',
        'hour_ago_plural': '__count__ timer siden',
        'hour_in': 'om __count__ time',
        'hour_in_plural': 'om __count__ timer',
        'day_ago': '__count__ dag siden',
        'day_ago_plural': '__count__ dager siden',
        'day_in': 'om __count__ dag',
        'day_in_plural': 'om __count__ dager'
      }
    },
    jp: {
      translation: {
        'now': 'たった今',
        'second_ago': '__count__ 秒前',
        'second_ago_plural': '__count__ 秒前',
        'second_in': 'あと __count__ 秒',
        'second_in_plural': 'あと __count__ 秒',
        'minute_ago': '__count__ 分前',
        'minute_ago_plural': '__count__ 分前',
        'minute_in': 'あと __count__ 分',
        'minute_in_plural': 'あと __count__ 分',
        'hour_ago': '__count__ 時間前',
        'hour_ago_plural': '__count__ 時間前',
        'hour_in': 'あと __count__ 時間',
        'hour_in_plural': 'あと __count__ 時間',
        'day_ago': '__count__ 日間前',
        'day_ago_plural': '__count__ 日間前',
        'day_in': 'あと __count__ 日間',
        'day_in_plural': 'あと __count__ 日間'
      }
    },
    pt: {
      translation: {
        'now': 'neste exato momento',
        'second_ago': '__count__ segundo atrás',
        'second_ago_plural': '__count__ segundos atrás',
        'second_in': 'em __count__ segundo',
        'second_in_plural': 'em __count__ segundos',
        'minute_ago': '__count__ minuto atrás',
        'minute_ago_plural': '__count__ minutos atrás',
        'minute_in': 'em __count__ minuto',
        'minute_in_plural': 'em __count__ minutos',
        'hour_ago': '__count__ hora atrás',
        'hour_ago_plural': '__count__ horas atrás',
        'hour_in': 'em __count__ hora',
        'hour_in_plural': 'em __count__ horas',
        'day_ago': '__count__ dia atrás',
        'day_ago_plural': '__count__ dias atrás',
        'day_in': 'em __count__ dia',
        'day_in_plural': 'em __count__ dias',
        'month_ago': '__count__ mês atrás',
        'month_ago_plural': '__count__ meses atrás',
        'month_in': 'em __count__ mês',
        'month_in_plural': 'em __count__ meses',
        'year_ago': '__count__ ano atrás',
        'year_ago_plural': '__count__ anos atrás',
        'year_in': 'em __count__ ano',
        'year_in_plural': 'em __count__ anos'
      }
    },
    zh: {
      translation: {
        'now': '刚才',
        'second_ago': '__count__ 秒钟前',
        'second_ago_plural': '__count__ 秒钟前',
        'second_in': '__count__ 秒内',
        'second_in_plural': '__count__ 秒内',
        'minute_ago': '__count__ 分钟前',
        'minute_ago_plural': '__count__ 分钟前',
        'minute_in': '__count__ 分钟内',
        'minute_in_plural': '__count__ 分钟内',
        'hour_ago': '__count__ 小时前',
        'hour_ago_plural': '__count__ 小时前',
        'hour_in': '__count__ 小时内',
        'hour_in_plural': '__count__ 小时内',
        'day_ago': '__count__ 天前',
        'day_ago_plural': '__count__ 天前',
        'day_in': '__count__ 天内',
        'day_in_plural': '__count__ 天内',
        'month_ago': '__count__ 月前',
        'month_ago_plural': '__count__ 月前',
        'month_in': '__count__ 月内',
        'month_in_plural': '__count__ 月内',
        'year_ago': '__count__ 年前',
        'year_ago_plural': '__count__ 年前',
        'year_in': '__count__ 年内',
        'year_in_plural': '__count__ 年内'
      }
    },
    'zh-CN': {
      translation: {
        'now': '刚才',
        'second_ago': '__count__ 秒钟前',
        'second_ago_plural': '__count__ 秒钟前',
        'second_in': '__count__ 秒内',
        'second_in_plural': '__count__ 秒内',
        'minute_ago': '__count__ 分钟前',
        'minute_ago_plural': '__count__ 分钟前',
        'minute_in': '__count__ 分钟内',
        'minute_in_plural': '__count__ 分钟内',
        'hour_ago': '__count__ 小时前',
        'hour_ago_plural': '__count__ 小时前',
        'hour_in': '__count__ 小时内',
        'hour_in_plural': '__count__ 小时内',
        'day_ago': '__count__ 天前',
        'day_ago_plural': '__count__ 天前',
        'day_in': '__count__ 天内',
        'day_in_plural': '__count__ 天内',
        'month_ago': '__count__ 月前',
        'month_ago_plural': '__count__ 月前',
        'month_in': '__count__ 月内',
        'month_in_plural': '__count__ 月内',
        'year_ago': '__count__ 年前',
        'year_ago_plural': '__count__ 年前',
        'year_in': '__count__ 年内',
        'year_in_plural': '__count__ 年内'
      }
    },
    'zh-HK': {
      translation: {
        'now': '剛才',
        'second_ago': '__count__ 秒鐘前',
        'second_ago_plural': '__count__ 秒鐘前',
        'second_in': '__count__ 秒內',
        'second_in_plural': '__count__ 秒內',
        'minute_ago': '__count__ 分鐘前',
        'minute_ago_plural': '__count__ 分鐘前',
        'minute_in': '__count__ 分鐘內',
        'minute_in_plural': '__count__ 分鐘內',
        'hour_ago': '__count__ 小時前',
        'hour_ago_plural': '__count__ 小時前',
        'hour_in': '__count__ 小時內',
        'hour_in_plural': '__count__ 小時內',
        'day_ago': '__count__ 天前',
        'day_ago_plural': '__count__ 天前',
        'day_in': '__count__ 天內',
        'day_in_plural': '__count__ 天內',
        'month_ago': '__count__ 月前',
        'month_ago_plural': '__count__ 月前',
        'month_in': '__count__ 月內',
        'month_in_plural': '__count__ 月內',
        'year_ago': '__count__ 年前',
        'year_ago_plural': '__count__ 年前',
        'year_in': '__count__ 年內',
        'year_in_plural': '__count__ 年內'
      }
    },
    'zh-TW': {
      translation: {
        'now': '剛才',
        'second_ago': '__count__ 秒鐘前',
        'second_ago_plural': '__count__ 秒鐘前',
        'second_in': '__count__ 秒內',
        'second_in_plural': '__count__ 秒內',
        'minute_ago': '__count__ 分鐘前',
        'minute_ago_plural': '__count__ 分鐘前',
        'minute_in': '__count__ 分鐘內',
        'minute_in_plural': '__count__ 分鐘內',
        'hour_ago': '__count__ 小時前',
        'hour_ago_plural': '__count__ 小時前',
        'hour_in': '__count__ 小時內',
        'hour_in_plural': '__count__ 小時內',
        'day_ago': '__count__ 天前',
        'day_ago_plural': '__count__ 天前',
        'day_in': '__count__ 天內',
        'day_in_plural': '__count__ 天內',
        'month_ago': '__count__ 月前',
        'month_ago_plural': '__count__ 月前',
        'month_in': '__count__ 月內',
        'month_in_plural': '__count__ 月內',
        'year_ago': '__count__ 年前',
        'year_ago_plural': '__count__ 年前',
        'year_in': '__count__ 年內',
        'year_in_plural': '__count__ 年內'
      }
    }
  };
});
define('aurelia-i18n/df',['exports', 'aurelia-logging', './i18n', 'aurelia-templating-resources', 'aurelia-binding'], function (exports, _aureliaLogging, _i18n, _aureliaTemplatingResources, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DfBindingBehavior = exports.DfValueConverter = undefined;

  var LogManager = _interopRequireWildcard(_aureliaLogging);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  

  var DfValueConverter = exports.DfValueConverter = function () {
    DfValueConverter.inject = function inject() {
      return [_i18n.I18N];
    };

    function DfValueConverter(i18n) {
      

      this.service = i18n;
    }

    DfValueConverter.prototype.toView = function toView(value, dfOrOptions, locale, df) {
      if (value === null || typeof value === 'undefined' || typeof value === 'string' && value.trim() === '') {
        return value;
      }

      if (dfOrOptions && typeof dfOrOptions.format === 'function') {
        return dfOrOptions.format(value);
      } else if (df) {
        var i18nLogger = LogManager.getLogger('i18n');
        i18nLogger.warn('This ValueConverter signature is depcrecated and will be removed in future releases. Please use the signature [dfOrOptions, locale]');
      } else {
        df = this.service.df(dfOrOptions, locale || this.service.getLocale());
      }

      if (typeof value === 'string' && isNaN(value) && !Number.isInteger(value)) {
        value = new Date(value);
      }

      return df.format(value);
    };

    return DfValueConverter;
  }();

  var DfBindingBehavior = exports.DfBindingBehavior = function () {
    DfBindingBehavior.inject = function inject() {
      return [_aureliaTemplatingResources.SignalBindingBehavior];
    };

    function DfBindingBehavior(signalBindingBehavior) {
      

      this.signalBindingBehavior = signalBindingBehavior;
    }

    DfBindingBehavior.prototype.bind = function bind(binding, source) {
      this.signalBindingBehavior.bind(binding, source, 'aurelia-translation-signal');

      var sourceExpression = binding.sourceExpression;

      if (sourceExpression.rewritten) {
        return;
      }
      sourceExpression.rewritten = true;

      var expression = sourceExpression.expression;
      sourceExpression.expression = new _aureliaBinding.ValueConverter(expression, 'df', sourceExpression.args, [expression].concat(sourceExpression.args));
    };

    DfBindingBehavior.prototype.unbind = function unbind(binding, source) {
      this.signalBindingBehavior.unbind(binding, source);
    };

    return DfBindingBehavior;
  }();
});
define('aurelia-i18n/nf',['exports', 'aurelia-logging', './i18n', 'aurelia-templating-resources', 'aurelia-binding'], function (exports, _aureliaLogging, _i18n, _aureliaTemplatingResources, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NfBindingBehavior = exports.NfValueConverter = undefined;

  var LogManager = _interopRequireWildcard(_aureliaLogging);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  

  var NfValueConverter = exports.NfValueConverter = function () {
    NfValueConverter.inject = function inject() {
      return [_i18n.I18N];
    };

    function NfValueConverter(i18n) {
      

      this.service = i18n;
    }

    NfValueConverter.prototype.toView = function toView(value, nfOrOptions, locale, nf) {
      if (value === null || typeof value === 'undefined' || typeof value === 'string' && value.trim() === '') {
        return value;
      }

      if (nfOrOptions && typeof nfOrOptions.format === 'function') {
        return nfOrOptions.format(value);
      } else if (nf) {
        var i18nLogger = LogManager.getLogger('i18n');
        i18nLogger.warn('This ValueConverter signature is depcrecated and will be removed in future releases. Please use the signature [nfOrOptions, locale]');
      } else {
        nf = this.service.nf(nfOrOptions, locale || this.service.getLocale());
      }

      return nf.format(value);
    };

    return NfValueConverter;
  }();

  var NfBindingBehavior = exports.NfBindingBehavior = function () {
    NfBindingBehavior.inject = function inject() {
      return [_aureliaTemplatingResources.SignalBindingBehavior];
    };

    function NfBindingBehavior(signalBindingBehavior) {
      

      this.signalBindingBehavior = signalBindingBehavior;
    }

    NfBindingBehavior.prototype.bind = function bind(binding, source) {
      this.signalBindingBehavior.bind(binding, source, 'aurelia-translation-signal');

      var sourceExpression = binding.sourceExpression;

      if (sourceExpression.rewritten) {
        return;
      }
      sourceExpression.rewritten = true;

      var expression = sourceExpression.expression;
      sourceExpression.expression = new _aureliaBinding.ValueConverter(expression, 'nf', sourceExpression.args, [expression].concat(sourceExpression.args));
    };

    NfBindingBehavior.prototype.unbind = function unbind(binding, source) {
      this.signalBindingBehavior.unbind(binding, source);
    };

    return NfBindingBehavior;
  }();
});
define('aurelia-i18n/rt',['exports', './relativeTime'], function (exports, _relativeTime) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RtValueConverter = undefined;

  

  var RtValueConverter = exports.RtValueConverter = function () {
    RtValueConverter.inject = function inject() {
      return [_relativeTime.RelativeTime];
    };

    function RtValueConverter(relativeTime) {
      

      this.service = relativeTime;
    }

    RtValueConverter.prototype.toView = function toView(value) {
      if (value === null || typeof value === 'undefined' || typeof value === 'string' && value.trim() === '') {
        return value;
      }

      if (typeof value === 'string' && isNaN(value) && !Number.isInteger(value)) {
        value = new Date(value);
      }

      return this.service.getRelativeTime(value);
    };

    return RtValueConverter;
  }();
});
define('aurelia-i18n/t',['exports', './i18n', 'aurelia-event-aggregator', 'aurelia-templating', 'aurelia-templating-resources', 'aurelia-binding', './utils'], function (exports, _i18n, _aureliaEventAggregator, _aureliaTemplating, _aureliaTemplatingResources, _aureliaBinding, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TBindingBehavior = exports.TCustomAttribute = exports.TParamsCustomAttribute = exports.TValueConverter = undefined;

  var _dec, _class, _class2, _temp, _dec2, _class3, _class4, _temp2, _class5, _temp3;

  

  var TValueConverter = exports.TValueConverter = function () {
    TValueConverter.inject = function inject() {
      return [_i18n.I18N];
    };

    function TValueConverter(i18n) {
      

      this.service = i18n;
    }

    TValueConverter.prototype.toView = function toView(value, options) {
      return this.service.tr(value, options);
    };

    return TValueConverter;
  }();

  var TParamsCustomAttribute = exports.TParamsCustomAttribute = (_dec = (0, _aureliaTemplating.customAttribute)('t-params'), _dec(_class = (_temp = _class2 = function () {
    function TParamsCustomAttribute(element) {
      

      this.element = element;
    }

    TParamsCustomAttribute.prototype.valueChanged = function valueChanged() {};

    return TParamsCustomAttribute;
  }(), _class2.inject = [Element], _temp)) || _class);
  var TCustomAttribute = exports.TCustomAttribute = (_dec2 = (0, _aureliaTemplating.customAttribute)('t'), _dec2(_class3 = (_temp2 = _class4 = function () {
    function TCustomAttribute(element, i18n, ea, tparams) {
      

      this.element = element;
      this.service = i18n;
      this.ea = ea;
      this.lazyParams = tparams;
    }

    TCustomAttribute.prototype.bind = function bind() {
      var _this = this;

      this.params = this.lazyParams();

      if (this.params) {
        this.params.valueChanged = function (newParams, oldParams) {
          _this.paramsChanged(_this.value, newParams, oldParams);
        };
      }

      var p = this.params !== null ? this.params.value : undefined;
      this.subscription = this.ea.subscribe('i18n:locale:changed', function () {
        _this.service.updateValue(_this.element, _this.value, _this.params !== null ? _this.params.value : undefined);
      });

      this.service.updateValue(this.element, this.value, p);
    };

    TCustomAttribute.prototype.paramsChanged = function paramsChanged(newValue, newParams) {
      this.service.updateValue(this.element, newValue, newParams);
    };

    TCustomAttribute.prototype.valueChanged = function valueChanged(newValue) {
      var p = this.params !== null ? this.params.value : undefined;
      this.service.updateValue(this.element, newValue, p);
    };

    TCustomAttribute.prototype.unbind = function unbind() {
      if (this.subscription) {
        this.subscription.dispose();
      }
    };

    return TCustomAttribute;
  }(), _class4.inject = [Element, _i18n.I18N, _aureliaEventAggregator.EventAggregator, _utils.LazyOptional.of(TParamsCustomAttribute)], _temp2)) || _class3);
  var TBindingBehavior = exports.TBindingBehavior = (_temp3 = _class5 = function () {
    function TBindingBehavior(signalBindingBehavior) {
      

      this.signalBindingBehavior = signalBindingBehavior;
    }

    TBindingBehavior.prototype.bind = function bind(binding, source) {
      this.signalBindingBehavior.bind(binding, source, 'aurelia-translation-signal');

      var sourceExpression = binding.sourceExpression;

      if (sourceExpression.rewritten) {
        return;
      }
      sourceExpression.rewritten = true;

      var expression = sourceExpression.expression;
      sourceExpression.expression = new _aureliaBinding.ValueConverter(expression, 't', sourceExpression.args, [expression].concat(sourceExpression.args));
    };

    TBindingBehavior.prototype.unbind = function unbind(binding, source) {
      this.signalBindingBehavior.unbind(binding, source);
    };

    return TBindingBehavior;
  }(), _class5.inject = [_aureliaTemplatingResources.SignalBindingBehavior], _temp3);
});
define('aurelia-i18n/utils',['exports', 'aurelia-dependency-injection'], function (exports, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LazyOptional = exports.assignObjectToKeys = exports.extend = undefined;

  

  var _dec, _class;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var extend = exports.extend = function extend(destination, source) {
    for (var property in source) {
      destination[property] = source[property];
    }

    return destination;
  };

  var assignObjectToKeys = exports.assignObjectToKeys = function assignObjectToKeys(root, obj) {
    if (obj === undefined || obj === null) {
      return obj;
    }

    var opts = {};

    Object.keys(obj).map(function (key) {
      if (_typeof(obj[key]) === 'object') {
        extend(opts, assignObjectToKeys(key, obj[key]));
      } else {
        opts[root !== '' ? root + '.' + key : key] = obj[key];
      }
    });

    return opts;
  };

  var LazyOptional = exports.LazyOptional = (_dec = (0, _aureliaDependencyInjection.resolver)(), _dec(_class = function () {
    function LazyOptional(key) {
      

      this.key = key;
    }

    LazyOptional.prototype.get = function get(container) {
      var _this = this;

      return function () {
        if (container.hasResolver(_this.key, false)) {
          return container.get(_this.key);
        }
        return null;
      };
    };

    LazyOptional.of = function of(key) {
      return new LazyOptional(key);
    };

    return LazyOptional;
  }()) || _class);
});
define('aurelia-i18n/base-i18n',['exports', './i18n', 'aurelia-event-aggregator'], function (exports, _i18n, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BaseI18N = undefined;

  

  var _class, _temp;

  var BaseI18N = exports.BaseI18N = (_temp = _class = function () {
    function BaseI18N(i18n, element, ea) {
      var _this = this;

      

      this.i18n = i18n;
      this.element = element;

      this.__i18nDisposer = ea.subscribe('i18n:locale:changed', function () {
        _this.i18n.updateTranslations(_this.element);
      });
    }

    BaseI18N.prototype.attached = function attached() {
      this.i18n.updateTranslations(this.element);
    };

    BaseI18N.prototype.detached = function detached() {
      this.__i18nDisposer.dispose();
    };

    return BaseI18N;
  }(), _class.inject = [_i18n.I18N, Element, _aureliaEventAggregator.EventAggregator], _temp);
});
define('jwt-decode/base64_url_decode',['require','exports','module','./atob'],function (require, exports, module) {var atob = require('./atob');

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
    var code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = '0' + code;
    }
    return '%' + code;
  }));
}

module.exports = function(str) {
  var output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }

  try{
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
};

});

define('jwt-decode/atob',['require','exports','module'],function (require, exports, module) {/**
 * The code was extracted from:
 * https://github.com/davidchambers/Base64.js
 */

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function InvalidCharacterError(message) {
  this.message = message;
}

InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

function polyfill (input) {
  var str = String(input).replace(/=+$/, '');
  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}


module.exports = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;

});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./styles.css\"></require>\n\n  <nav class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\">\n    <div class=\"container-fluid\">\n      <div class=\"navbar-header\">\n        <a class=\"navbar-brand\" route-href=\"route: home\">\n          <i class=\"fa fa-user\"></i>\n          <span t=\"title\"/>\n        </a>\n      </div>\n      <div class=\"navbar-collapse collapse\">\n        <ul if.bind=\"isAuthenticated\" class=\"nav navbar-nav navbar-right\">\n          <li><a route-href=\"route: map\"><span t=\"map\" /></a></li>\n          <li><a href=\"#\" click.delegate=\"logout()\"><span t=\"logout\" /></a></li>\n        </ul>\n        <ul if.bind=\"!isAuthenticated\" class=\"nav navbar-nav navbar-right\">\n          <li><a href=\"#\" click.delegate=\"login()\"><span t=\"login\" /></a></li>\n        </ul>\n      </div>\n    </div>\n  </nav>\n\n  <loading-indicator loading.bind=\"router.isNavigating || api.isRequesting\"></loading-indicator>\n\n  <div class=\"container-fluid\">\n    <div class=\"row\">\n      <router-view class=\"col-md-12\"></router-view>\n    </div>\n  </div>\n\n</template>\n"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body { padding-top: 50px; }\n\na:focus {\n  outline: none;\n}\n\n.navbar-nav li.loader {\n    margin: 12px 24px 0 6px;\n}\n\n.no-selection {\n  margin: 10px;\n}\n\n.panel {\n  margin: 10px;\n}\n\n.button-bar {\n  right: 0;\n  left: 0;\n  bottom: 0;\n  border-top: 1px solid #ddd;\n  background: white;\n}\n\n.button-bar > button {\n  float: right;\n  margin: 20px;\n}\n\nli.list-group-item {\n  list-style: none;\n}\n\nli.list-group-item > a {\n  text-decoration: none;\n}\n\nli.list-group-item.active > a {\n  color: white;\n"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"no-selection text-center\">\n    <h2>${message}</h2>\n  </div>\n</template>\n"; });
define('text!map.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"leaflet/leaflet.css\"></require>\n\n  <div class=\"no-selection text-center\">\n\n    <!-- Error Message Box -->\n    <div if.bind=\"error\" class=\"alert alert-danger\" role=\"alert\">\n      <span class=\"sr-only\">Error:</span>\n      ${error}\n    </div>\n\n    <!-- Map -->\n    <!-- TODO: Set size dynamically -->\n    <div id=\"mapContainer\" style=\"height:400px\"></div>\n\n    <!-- Data Table -->\n    <div id=\"tableContainer\" style=\"overflow-y: scroll; height:300px;\">\n      <table class=\"table table-striped\" aurelia-table=\"data.bind: users;\n        display-data.bind: $displayData; current-page.bind: currentPage;\n        page-size.bind: pageSize; total-items.bind: totalItems;\">\n        <thead>\n          <tr>\n            <th>Name</th>\n            <th>Age</th>\n            <th>E-mail</th>\n            <th>Address</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr repeat.for=\"user of $displayData\">\n            <td>${user.name}</td>\n            <td>${user.age}</td>\n            <td><a href=\"mailto:${user.email}\">${user.email}</a></td>\n            <td>${user.address.street + ', ' + user.address.city}</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n\n    <!-- Pagination -->\n    <!--<div class=\"row\">\n      <div class=\"col-md-12\">\n        <aut-pagination current-page.bind=\"currentPage\" page-size.bind=\"pageSize\" total-items.bind=\"totalItems\"\n        pagination-size.bind=\"5\" boundary-links.bind=\"true\"> </aut-pagination>\n      </div>\n    </div>-->\n\n  </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map