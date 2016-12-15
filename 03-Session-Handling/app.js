$(document).ready(function() {
  
  var btn_login = $('.btn-login');
  var btn_logout = $('.btn-logout');

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

  var idToken = localStorage.getItem('id_token') || null;
  var profile = localStorage.getItem('profile') || null;

  if (idToken) {
    useLoggedInScenario();
  } else {
    useLoggedOutScenario();
  }

  if (profile) {
    displayProfile(JSON.parse(profile));
  }

  if (authResult && authResult.accessToken && authResult.idToken) {
    window.location.hash = '';
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    if (!profile) {
      getProfile(authResult.accessToken);
    }
    useLoggedInScenario();
  }

  btn_login.click(function(e) {
    e.preventDefault();
    login();
  });

  btn_logout.click(function(e) {
    e.preventDefault();
    logout();
  });

  function login() {
    auth0.login({
      responseType: 'token id_token',
      scope: 'openid',
      nonce: nonce
    });
  }

  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    useLoggedOutScenario();
    window.location.href = "/";
  }
  
  function getProfile(accessToken) {
    auth0.getUserInfo(accessToken, function(err, profile) {
      if (err) { 
        console.log(error);
        return;
      }
      localStorage.setItem('profile', JSON.stringify(profile));
      displayProfile(profile);
    });
  }

  function displayProfile(profile) {
    $('.avatar').attr('src', profile.picture);
    $('.nickname').text(profile.nickname);
    $('.email').text(profile.email);
    $('.full-profile').text(JSON.stringify(profile, null, 2));
  }

  function useLoggedInScenario() {
    $('#login-message').hide();
    $('#logged-in-message').show();
    $('.btn-login').hide();
    $('.btn-logout').show();
    $('.profile-area').show();
  }
  
  function useLoggedOutScenario() {
    $('#login-message').show();
    $('#logged-in-message').hide();
    $('.btn-login').show();
    $('.btn-logout').hide();
    $('.profile-area').hide();
  }
});