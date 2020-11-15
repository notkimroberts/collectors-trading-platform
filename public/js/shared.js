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

  function showAdminSelect(){
   if(document.getElementById("no").checked = true)
   {
      $(".show").show()
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

    const $errorMessage =$('#errorMessage');
    $errorMessage.text(message);
    $errorMessage.show();
  }

  function redirectIfLoggedIn() {

    if (sessionStorage.user_id) {
    window.location=`/`;
    }
  }


  function setIdRedirect(result) {
    sessionStorage.user_id = result.collector_id;
    window.location='/profile';
  }


  function logout() {
      sessionStorage.removeItem('user_id');
      $.get(`${AUTH_URL}/logout`)
        .then(result => {
            window.location = '/login';
        })
  }