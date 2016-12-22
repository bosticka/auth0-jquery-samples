$(document).ready(function() {
  
  var btn_login = $('.btn-login');
  var btn_logout = $('.btn-logout');
  var btn_call_public = $('.btn-call-public');
  var btn_call_private = $('.btn-call-private');

  var publicEndpoint = 'http://localhost:3001/api/public';
  var privateEndpoint = 'http://localhost:3001/api/private';

  var auth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID
  });

  var authResult = auth.parseHash(window.location.hash);

  var idToken = localStorage.getItem('id_token') || null;
  var accessToken = localStorage.getItem('access_token') || null;
  var profile = localStorage.getItem('profile') || null;

  if (profile) {
    displayProfile(JSON.parse(profile), idToken);
  }

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
    if (!profile) {
      getProfile(authResult.accessToken, authResult.idToken);
    }
    showAccessToken(authResult.accessToken);
    userIsAuthenticated();
  }

  btn_login.click(function(e) {
    e.preventDefault();
    login();
  });

  btn_logout.click(function(e) {
    e.preventDefault();
    logout();
  });

  btn_call_public.click(function(e) {
    e.preventDefault();
    $.get(publicEndpoint).done(function(data) {
      $('.api-call-result').text(data.message);
    }).fail(function(error) {
      $('.api-call-result').text(error.statusText);
    });
  });

  btn_call_private.click(function(e) {
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
  }
  
  function userIsNotAuthenticated() {
    $('#login-message').show();
    $('#logged-in-message').hide();
    $('.btn-login').show();
    $('.btn-logout').hide();
    $('.access-token-area').hide();
  }

  function route() {
    var currentLocation = window.location.pathname;
    if (idToken && !isTokenExpired(idToken)) {

      var role = getRole(idToken);

      switch(currentLocation) {
        case "/":
          if (role === 'admin') { $('#btn-go-admin').show(); }
          if (role === 'admin' || role === 'user') { $('#btn-go-user').show(); }
          break;
        case "/user.html":
          if (getRole(idToken) !== ('user' || 'admin')) {
            window.location.href = "/";
          } else {
            $('.container').show();
            $('#btn-logout').show();
            $('#nickname').text(profile.nickname);
          }
          break;
        case "/admin.html":
          if (getRole(idToken) !== 'admin') {
            window.location.href = "/";
          } else {
            $('.container').show();
            $('#btn-logout').show();
            $('#nickname').text(profile.nickname);
          }
          break;
      }
      
    } else {
      // user is not logged in.
      // Call logout just to be sure our local session is cleaned up.
      if (currentLocation !== '/') {
        logout();
      }
    }
  }
  route();
});
