$(document).ready(function() {

  var userProfile;

  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    oidcConformant: true,
    autoclose: true,
    auth: {
      redirectUrl: AUTH0_CALLBACK_URL,
      responseType: 'token id_token',
      audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
      params: {
        scope: 'openid profile'
      }
    }
  });

  $('.content').show();
  $('#home').show();
  $('#loading').hide();

  $('#btn-login').click(function(e) {
    e.preventDefault();
    login();
  });

  $('#btn-logout').click(function(e) {
    e.preventDefault();
    logout();
  });

  $('#btn-home').click(function(e) {
    e.preventDefault();
    showRoute('home');
  });

  $('#btn-profile').click(function(e) {
    e.preventDefault();
    showRoute('profile');
  });

  if(isAuthenticated()) {
    displayAsAuthenticated();
    if (userProfile) {
      $('.full-profile').append(JSON.stringify(userProfile, null, 2));
    } else {
      getProfile();
    }
  } else {
    displayAsNotAuthenticated();
  }

  lock.on('authenticated', function(authResult) {
    window.location.hash = '';
    if (authResult && authResult.accessToken && authResult.idToken) {
      setSession(authResult);
      displayAsAuthenticated();
      getProfile();
    } else if (authResult && authResult.error) {
      alert('Error: ' + authResult.error);
    }
  });

  function getProfile() {
    var accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw 'Access token must exist to fetch profile';
    }
    lock.getUserInfo(accessToken, function(err, profile) {
      userProfile = profile;
      if (profile) {
        $('.avatar').attr('src', profile.picture);
        $('.nickname').append(profile.nickname);
        $('.full-profile').append(JSON.stringify(profile, null, 2));
      }
    });
  }

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
    showRoute('home');
    displayAsNotAuthenticated();
  }

  function isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  function displayAsAuthenticated() {
    ['#login-message', '#btn-login']
      .forEach(function(item) {
        $(item).hide();
      });

    ['#logged-in-message', '#btn-logout', '#btn-profile']
      .forEach(function(item) {
        $(item).show();
      });
  }

  function displayAsNotAuthenticated() {
    ['#logged-in-message', '#btn-logout', '#btn-profile']
      .forEach(function(item) {
        $(item).hide();
      });

    ['#login-message', '#btn-login']
      .forEach(function(item) {
        $(item).show();
      });
  }

  function showRoute(route) {
    $('.route').each(function() {
      $(this).hide();
    });
    $('#' + route).show();
  }
});
