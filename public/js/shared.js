$.ajaxSetup({
    crossDomain: true,
    xhrFields: {
       withCredentials: true
    },

});

// https://www.youtube.com/watch?v=2ZcP3kO5kkE
const API_URL = getHostURL();
const AUTH_URL = `${API_URL}/auth`

function getHostURL() {
    if (window.location.host.indexOf('localhost') != -1) {
      return 'http://localhost:3000';
    } else {
      return 'https://collectors-trading-platform.herokuapp.com';
    }
  } 

  function logout() {
      $.get(`${AUTH_URL}/logout`)
        .then(result => {
            window.location = '/login';
        })
  }