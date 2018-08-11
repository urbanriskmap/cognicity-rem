const jwtDecode = require('jwt-decode');

// Import environment variables
import env from './environment';

const webAuth = new auth0.WebAuth({
  domain: env.AUTH0_DOMAIN,
  clientID: env.AUTH0_CLIENT_ID,
  responseType: 'token id_token',
  scope: 'openid',
  redirectUri: env.baseUrl+'/callback'
});


export function tokenIsExpired() {
  let jwt = localStorage.getItem('id_token');
  if (jwt) {
    let jwtExp = jwtDecode(jwt).exp;
    let expiryDate = new Date(0);
    expiryDate.setUTCSeconds(jwtExp);

    // Check date against expiry date
    if (new Date() < expiryDate) return false;
  }
  return true;
}

export function getProfile() {
  let profile = localStorage.getItem('profile');
  if (profile) return JSON.parse(profile);
  return null;
}

// Format timestamps to local time
export function formatTime(timestamp_ISO8601){
  let utc = new Date(timestamp_ISO8601).getTime();
  let ict = utc + 3600 * 7 * 1000; // Add 7 hours for UTC+7
  let timestring = new Date(ict).toISOString();
  timestring = timestring.split('T'); // Split time and ate
  let t1 = timestring[1].slice(0,5); // Extract HH:MM
  let d1 = timestring[0].split('-'); // Extract DD-MM-YY
  let d2 = d1[2]+'-'+d1[1]+'-'+d1[0];
  return (t1 + ' ' + d2);
}


// Once authenticated save the id_token and profile to local storage
export function handleAuthentication(router) {
  webAuth.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {

      webAuth.client.userInfo(authResult.accessToken, function(err, profile) {
        if (err)
        {
          console.log(err);
          return;

        }

        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        router.navigate('map');
        document.dispatchEvent(new Event('auth-changed'));
      });

    } else if (err) {
      console.log(err);
    }
  });
}


export function auth_login() {
   webAuth.authorize();
}

export function auth_logout() {
  localStorage.removeItem('profile');
  localStorage.removeItem('id_token');
  // Redirect to the home view
  webAuth.logout({
    returnTo: env.baseUrl,
    clientID: env.AUTH0_CLIENT_ID
  });
}
