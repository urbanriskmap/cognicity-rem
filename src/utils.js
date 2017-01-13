const jwtDecode = require('jwt-decode');

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
