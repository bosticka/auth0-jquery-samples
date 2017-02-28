$(document).ready(function() {
  
  $('.content').show();
  $('#home').show();
  $('#loading').hide();

  var webAuth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    responseType: 'token id_token',
    audience: 'https://' + AUTH0_DOMAIN + '/userinfo'
  });

  var authResult = webAuth.parseHash(function(err, authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      setSession(authResult);
      displayAsAuthenticated();
      $('#auth-form')[0].reset();
      showRoute('home');
    }
    if (err) {
      window.location.hash = '';
      alert('Error: ' + err.error);
    } else {
      displayAsNotAuthenticated();
    }
  });

  if(isAuthenticated()) {
    displayAsAuthenticated();
  } else {
    displayAsNotAuthenticated();
  }

  $('#btn-home').click(function(e) {
    showRoute('home');
  });

  $('#btn-login-route').click(function(e) {
    showRoute('login');
  });

  $('#btn-login').click(function(e) {
    e.preventDefault();
    var email = $('#email').val();
    var password = $('#password').val();

    webAuth.client.login({
      realm: 'Username-Password-Authentication',
      username: email,
      password: password,
    }, function(err, authResult) {
      if (err) {
        alert(err.description);
      }
      if (authResult && authResult.idToken && authResult.accessToken) {
        setSession(authResult);
        displayAsAuthenticated();
        $('#auth-form')[0].reset();
        showRoute('home');
      }
    });
  });

  $('#btn-signup').click(function(e) {
    e.preventDefault();
    var email = $('#email').val();
    var password = $('#password').val();

    webAuth.redirect.signupAndLogin({
      connection: 'Username-Password-Authentication',
      email: email,
      password: password,
    }, function(err) {
      if (err) {
        alert(err.description);
      }
    });
  });

  $('#btn-google').click(function(e) {
    e.preventDefault();
    webAuth.authorize({
      connection: 'google-oauth2'
    }, function(err) {
      if (err) {
        alert(err.description);
      }
    });
  });

  $('#btn-logout').click(function(e) {
     e.preventDefault();
     logout();
  });

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
    webAuth.logout({client_id: AUTH0_CLIENT_ID, redirect_to: 'http://localhost:3000'})
    displayAsNotAuthenticated();
  }

  function isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  function displayAsAuthenticated() {
    ['#login-form, #login-message', '#btn-login-route']
      .forEach(function(item) {
        $(item).hide();
      });

    ['#logged-in-message', '#btn-logout']
      .forEach(function(item) {
        $(item).show();
      });
  }

  function displayAsNotAuthenticated() {
    ['#logged-in-message', '#btn-logout']
      .forEach(function(item) {
        $(item).hide();
      });

    ['#login-form', '#login-message', '#btn-login-route']
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
