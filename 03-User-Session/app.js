$(document).ready(function() {
  
  var btn_login = $('.btn-login');
  var btn_logout = $('.btn-logout');

  var auth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID
  });

  var authResult = auth.parseHash(window.location.hash);

  var idToken = localStorage.getItem('id_token') || null;
  var profile = localStorage.getItem('profile') || null;
  
  if (idToken && !isTokenExpired(idToken)) {
    if (profile) {
      displayProfile(JSON.parse(profile));
    }
    userIsAuthenticated();
  } else {
    userIsNotAuthenticated();
  }

  if (authResult && authResult.accessToken && authResult.idToken) {
    window.location.hash = '';
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    if (!profile) {
      getProfile(authResult.accessToken);
    }
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

  function login() {
    auth.login({
      responseType: 'token id_token',
      scope: 'openid profile',
      audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
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
  
  function getProfile(accessToken) {
    auth.client.userInfo(accessToken, function(err, profile) {
      if (err) { 
        console.log(error);
        return;
      }
      localStorage.setItem('profile', JSON.stringify(profile));
      displayProfile(profile);
    });
  }

  function isTokenExpired(token) {
    return jwt_decode(token).exp < Date.now() / 1000;
  }

  function displayProfile(profile) {
    $('.avatar').attr('src', profile.picture);
    $('.nickname').text(profile.nickname);
    $('.email').text(profile.email);
    $('.full-profile').text(JSON.stringify(profile, null, 2));
  }

  function userIsAuthenticated() {
    $('#login-message').hide();
    $('#logged-in-message').show();
    $('.btn-login').hide();
    $('.btn-logout').show();
    $('.profile-area').show();
  }
  
  function userIsNotAuthenticated() {
    $('#login-message').show();
    $('#logged-in-message').hide();
    $('.btn-login').show();
    $('.btn-logout').hide();
    $('.profile-area').hide();
  }
});