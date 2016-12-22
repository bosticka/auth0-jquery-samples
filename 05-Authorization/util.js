var namespace = 'https://example.com';

function isTokenExpired(token) {
  return jwt_decode(token).exp < Date.now() / 1000;
}

function getRole(idToken) {
  var decodedToken = jwt_decode(idToken);
  return decodedToken[namespace + '/role'];
}

// Configure AJAX calls to include the
// access token as an Authorization header
$.ajaxSetup({
  'beforeSend': function(xhr) {
    if (localStorage.getItem('access_token')) {
      xhr.setRequestHeader(
        'Authorization', 'Bearer ' + localStorage.getItem('access_token')
      );
    }
  }
});