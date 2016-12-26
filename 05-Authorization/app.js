$(document).ready(function() {
  
  var btnLogin = $('.btn-login');
  var btnLogout = $('.btn-logout');
  var getItemsButton = $('.btn-get-items');

  var itemsEndpoint = 'http://localhost:3001/api/items';

  var auth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID
  });

  var authResult = auth.parseHash(window.location.hash);

  var idToken = localStorage.getItem('id_token') || null;
  var accessToken = localStorage.getItem('access_token') || null;
  var profile = localStorage.getItem('profile') || null;

  if (idToken && !isTokenExpired(idToken)) {
    if (profile) {
      displayProfile(JSON.parse(profile), idToken);
    }
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
    if (!profile) {
      getProfile(authResult.accessToken, authResult.idToken);
    }
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

  getItemsButton.click(function(e) {
    e.preventDefault();
    $.get(itemsEndpoint).done(function(data) {
      $('.api-call-result').text(data.items);
    }).fail(function(error) {
      $('.api-call-result').text(error.statusText);
    });
  });

  function login() {
    auth.login({
      responseType: 'token id_token',
      scope: 'openid profile read:items',
      audience: 'https://api.test.com',
      redirectUri: window.location.href
    });
  }

  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    userIsNotAuthenticated();
    window.location.href = "/";
  }

  function showAccessToken(token) {
    $('.access-token-area pre').text(token);
  }

  function getProfile(accessToken, idToken) {
    auth.client.userInfo(accessToken, function(err, profile) {
      if (err) { 
        console.log(error);
        return;
      }
      localStorage.setItem('profile', JSON.stringify(profile));
      displayProfile(profile, idToken);
    });
  }

  function displayProfile(profile, idToken) {
    $('.avatar').attr('src', profile.picture);
    $('.nickname').text(profile.nickname);
    $('.email').text(profile.email);
    $('.role').text(getRole(idToken));
    $('.full-profile').text(JSON.stringify(profile, null, 2));
  }

  function userIsAuthenticated() {
    $('#login-message').hide();
    $('#logged-in-message').show();
    $('.btn-login').hide();
    $('.btn-logout').show();
    $('.access-token-area').show();
    $('.profile-area').show();
  }
  
  function userIsNotAuthenticated() {
    $('#login-message').show();
    $('#logged-in-message').hide();
    $('.btn-login').show();
    $('.btn-logout').hide();
    $('.access-token-area').hide();
    $('.profile-area').hide();
  }

  function route() {
    var currentLocation = window.location.pathname;
    var idToken = localStorage.getItem('id_token');
    if (idToken && !isTokenExpired(idToken)) {

      var role = getRole(idToken);

      switch(currentLocation) {
        case "/":
          if (role === 'admin') { $('#btn-go-admin').show(); }
          if (role === 'admin' || role === 'user') { $('#btn-go-user').show(); }
          break;
        case "/user.html":
          if (!(role === 'admin' || role === 'user')) {
            window.location.href = "/";
          }
          break;
        case "/admin.html":
          if (role !== 'admin') {
            window.location.href = "/";
          }
          break;
      }
      
    } else {
      // User is not logged in.
      // Call logout just to be sure the local session is cleaned up
      if (currentLocation !== '/') {
        logout();
      }
    }
  }

  route();
});
