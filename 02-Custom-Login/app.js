$(document).ready(function() {

  var btnLogin = $('#btn-login');
  var btnSignup = $('#btn-signup');
  var btnLogout = $('#btn-logout');
  var btnGoogle = $('#btn-google');
  
  var auth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID
  });

  var authResult = auth.parseHash(window.location.hash);

  if (authResult && authResult.accessToken && authResult.idToken) {
    window.location.hash = '';
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    userIsAuthenticated();
  } else {
    userIsNotAuthenticated();
  }

  btnLogin.on('click', function(e) {
    e.preventDefault();
    var email = $('#email').val();
    var password = $('#password').val();

    auth.login({
      connection: 'Username-Password-Authentication',
      responseType: 'token id_token',
      redirectUri: AUTH0_CALLBACK_URL,
      email: email,
      password: password,
    }, function(err) {
      if (err) {
        alert(err.description);
      }
    });
  });

  btnSignup.on('click', function(e) {
    e.preventDefault();
    var email = $('#email').val();
    var password = $('#password').val();

    auth.signup({
      connection: 'Username-Password-Authentication',
      responseType: 'token id_token',
      redirectUri: AUTH0_CALLBACK_URL,
      email: email,
      password: password
    }, function(err, user) {
      if (err) {
        alert(err.description);
        return;
      }
      console.log(user);
    });
  });

  btnGoogle.on('click', function(e) {
    e.preventDefault();
    auth.login({
      connection: 'google-oauth2',
      responseType: 'token id_token',
      redirectUri: AUTH0_CALLBACK_URL,
    }, function(err) {
      if (err) {
        alert(err.description);
      }
    });
  });

  btnLogout.on('click', function(e) {
     e.preventDefault();
     localStorage.removeItem('access_token');
     localStorage.removeItem('id_token');
     window.location.href = "/";
  });

  function userIsAuthenticated() {
    $('.login-form').hide();
    $('#logged-in-message').show();
    $('#log-in-message').hide();
  }

  function userIsNotAuthenticated() {
    $('.login-form').show();
    $('#logged-in-message').hide();
    $('#log-in-message').show();
  }

});
