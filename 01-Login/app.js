$(document).ready(function() {

  $('#logged-in-message').hide();
  $('.btn-logout').hide();

  var auth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    callbackURL: AUTH0_CALLBACK_URL
  });

  var authResult = auth.parseHash(window.location.hash);

  if (authResult && authResult.accessToken && authResult.idToken) {
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
    auth.login({
      responseType: 'token',
      scope: 'openid',
      redirectUri: window.location.href
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
