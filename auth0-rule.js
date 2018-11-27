function (user, context, callback) {
  var namespace = 'https://semarang-rem.petabencana.id/';
  context.idToken[namespace + 'app_metadata'] = user.app_metadata;
  context.idToken[namespace + 'user_metadata'] = user.user_metadata;
  callback(null, user, context);
}