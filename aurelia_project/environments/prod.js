export default {
  debug: false,
  testing: false,
  dataUrl: 'https://data.petabencana.id',
  baseUrl: 'https://semarang-rem.petabencana.id',
  AUTH0_CLIENT_ID: 'ApdfZvV1BrxXmwdg6Djrle4m2nav5ub9',
  AUTH0_DOMAIN: 'petabencana.au.auth0.com',
  floodStates: [
    {
      level: null,
      severity: 'Tidak banjir',
      levelDescription: 'NO FLOODING'
    },
    {
      level: 1,
      severity: 'Hati-hati!',
      levelDescription: 'AN UNKNOWN LEVEL OF FLOODING - USE CAUTION -'
    },
    {
      level: 2,
      severity: '10 cm - 70 cm',
      levelDescription: 'FLOODING OF BETWEEN 10 and 70 CENTIMETERS'
    },
    {
      level: 3,
      severity: '71 cm - 150 cm',
      levelDescription: 'FLOODING OF BETWEEN 71 and 150 CENTIMETERS'
    },
    {
      level: 4,
      severity: '> 150 cm',
      levelDescription: 'FLOODING OF OVER 150 CENTIMETERS'
    }
  ],
  mapConfig: {
    region: 'srg',
    reports_refresh: 60000, // Reports will refresh every 60 seconds
    gauges_refresh: 900000, // Gauges will refresh every 15 minutes
    bounds: {
      sw: [-7.33525, 110.145],
      ne: [-6.85, 110.625]
    },
    basemaps: [
      {
        name: 'Mapbox',
        url: 'https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidXJiYW5yaXNrbWFwIiwiYSI6ImNpdmVhbTFraDAwNHIyeWw1ZDB6Y2hhbTYifQ.tpgt1PB5lkJ-wITS02c96Q',
        default: true,
        options: {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OSM</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
          detectRetina: true,
          subdomains: 'abcd',
          minZoom: 0,
          maxZoom: 18,
          ext: 'png'
        }
      }
    ],
    infrastructure: [
      {
        type: 'floodgates',
        name: 'Pintu air',
        default: true
      },
      {
        type: 'pumps',
        name: 'Pompa',
        default: false
      },
      {
        type: 'waterways',
        name: 'Jaringan kanal',
        default: false
      }
    ]
  }
};
