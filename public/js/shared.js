$.ajaxSetup({
    crossDomain: true,
    xhrFields: {
       withCredentials: true
    },

});

const API_URL = getHostURL();
const AUTH_URL = `${API_URL}/auth`

function getHostURL() {
    if (window.location.host.indexOf('localhost') != -1) {
      return 'http://localhost:3000';
    } else {
      return 'https://collectors-trading-platform.herokuapp.com/';
    }
  }
  

  function getUserFromForm() {

    const email = $('#email').val();
    const password = $('#password').val();

    const collector = {
        email,
        password
    };

    return collector;
  }

  function showErrorMessage(message) {

    const $errorMessage =$(`#errorMessage`);
    $errorMessage.text(message);
    $errorMessage.show();
  }

  function redirectIfLoggedIn() {

    if (sessionStorage.user_id) {
    window.location=`/`;
    }
  }


  function setIdRedirect(result) {
    console.log('in set id redirect');
    sessionStorage.user_id = result.collector_id;
    window.location=`/`;
  }


  function logout() {
      sessionStorage.removeItem('user_id');
      $.get(`${AUTH_URL}/logout`)
        .then(result => {
            window.location = '/login';
        })
  }