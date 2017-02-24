$(document).ready(function() {

  var btnLogin = $('#btn-login');
  var btnSignup = $('#btn-signup');
  var btnLogout = $('#btn-logout');
  var btnGoogle = $('#btn-google');
  
  var webAuth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    responseType: 'token id_token',
    audience: 'https://' + AUTH0_DOMAIN + '/userinfo'
  });

  var authResult = webAuth.parseHash(function(err, authResult) {
    console.log(authResult);
    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      userIsAuthenticated();
    } else {
      userIsNotAuthenticated();
    }
  });

  btnLogin.on('click', function(e) {
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
      setUser(authResult);
      userIsAuthenticated();
    });
  });

  btnSignup.on('click', function(e) {
    e.preventDefault();
    var email = $('#email').val();
    var password = $('#password').val();

    webAuth.redirect.signupAndLogin({
      connection: 'Username-Password-Authentication',
      email: email,
      password: password,
    }, function(err, authResult) {
      if (err) {
        alert(err.description);
      }
      setUser(authResult);
      userIsAuthenticated();
    });
  });

  btnGoogle.on('click', function(e) {
    e.preventDefault();
    webAuth.authorize({
      connection: 'google-oauth2'
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

  function setUser(authResult) {
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
  }

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
