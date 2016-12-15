$(document).ready(function() {

  $('#logged-in-message').hide();
  $('.btn-logout').hide();

  var auth0 = new Auth0({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    callbackURL: AUTH0_CALLBACK_URL
  });

  // make this a truly random string
  // for production applications
  var nonce = 'randomstring';

  var authResult = auth0.parseHash(window.location.hash, {
    nonce: nonce
  });

  if (authResult && authResult.accessToken && authResult.idToken) {
    window.location.hash = '';
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    $('#login-message').hide();
    $('#logged-in-message').show();
    $('.btn-login').hide();
    $('.btn-logout').show();
  }

  $('.btn-login').click(function(e) {
    e.preventDefault();
    login();
  });

  $('.btn-logout').click(function(e) {
    e.preventDefault();
    logout();
  });

  function login() {
    auth0.login({
      responseType: 'token id_token',
      scope: 'openid',
      audience: 'https://api.test.com',
      nonce: nonce
    });
  }

  var logout = function() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    window.location.href = "/";
    $('#login-message').show();
    $('#logged-in-message').hide();
    $('.btn-login').show();
    $('.btn-logout').hide();
  };
});
