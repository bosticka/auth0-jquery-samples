$(document).ready(function() {
  
  var btnLogin = $('.btn-login');
  var btnLogout = $('.btn-logout');
  var btnCallPublic = $('.btn-call-public');
  var btnCallPrivate = $('.btn-call-private');

  var publicEndpoint = 'http://localhost:3001/api/public';
  var privateEndpoint = 'http://localhost:3001/api/private';

  var auth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID
  });

  var authResult = auth.parseHash(window.location.hash);

  var idToken = localStorage.getItem('id_token') || null;
  var accessToken = localStorage.getItem('access_token') || null;

  if (idToken && !isTokenExpired(idToken)) {
    userIsAuthenticated();
  } else {
    userIsNotAuthenticated();
  }

  if (accessToken) {
    showAccessToken(accessToken);
  }

  if (authResult && authResult.accessToken && authResult.idToken) {
    window.location.hash = '';
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    showAccessToken(authResult.accessToken);
    userIsAuthenticated();
  }

  btnLogin.click(function(e) {
    e.preventDefault();
    login();
  });

  btnLogout.click(function(e) {
    e.preventDefault();
    logout();
  });

  btnCallPublic.click(function(e) {
    e.preventDefault();
    $.get(publicEndpoint).done(function(data) {
      $('.api-call-result').text(data.message);
    }).fail(function(error) {
      $('.api-call-result').text(error.statusText);
    });
  });

  btnCallPrivate.click(function(e) {
    e.preventDefault();
    $.get(privateEndpoint).done(function(data) {
      $('.api-call-result').text(data.message);
    }).fail(function(error) {
      $('.api-call-result').text(error.statusText);
    });
  });

  function login() {
    auth.login({
      responseType: 'token id_token',
      scope: 'openid profile',
      audience: 'https://api.test.com',
      redirectUri: window.location.href
    });
  }

  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    userIsNotAuthenticated();
    window.location.href = "/";
  }

  function isTokenExpired(token) {
    return jwt_decode(token).exp < Date.now() / 1000;
  }

  function showAccessToken(token) {
    $('.access-token-area pre').text(token);
  }

  function userIsAuthenticated() {
    $('#login-message').hide();
    $('#logged-in-message').show();
    $('.btn-login').hide();
    $('.btn-logout').show();
    $('.access-token-area').show();
  }
  
  function userIsNotAuthenticated() {
    $('#login-message').show();
    $('#logged-in-message').hide();
    $('.btn-login').show();
    $('.btn-logout').hide();
    $('.access-token-area').hide();
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
});