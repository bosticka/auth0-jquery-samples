$(document).ready(function() {

  $('.content').show();
  $('#loading').hide();

  $('#btn-login').click(function(e) {
    e.preventDefault();
    login();
  });

  $('#btn-logout').click(function(e) {
    e.preventDefault();
    logout();
  });

  if(isAuthenticated()) {
    displayAsAuthenticated();
  } else {
    displayAsNotAuthenticated();
  }

  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    oidcConformant: true,
    autoclose: true,
    auth: {
      redirectUrl: AUTH0_CALLBACK_URL,
      responseType: 'token id_token',
      audience: 'https://' + AUTH0_DOMAIN + '/userinfo'
    }
  });

  lock.on('authenticated', function(authResult) {
    window.location.hash = '';
    if (authResult && authResult.accessToken && authResult.idToken) {
      setSession(authResult);
      displayAsAuthenticated();
    } else if (authResult && authResult.error) {
      alert('Error: ' + authResult.error);
    }
  });

  function login() {
    lock.show();
  }

  function setSession(authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    displayAsNotAuthenticated();
  }

  function isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  function displayAsAuthenticated() {
    $('#login-message').hide();
    $('#logged-in-message').show();
    $('#btn-login').hide();
    $('#btn-logout').show();
  }

  function displayAsNotAuthenticated() {
    $('#login-message').show();
    $('#logged-in-message').hide();
    $('#btn-login').show();
    $('#btn-logout').hide();
  }
});
