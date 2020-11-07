/* const { error } = require("jquery"); */
// https://www.youtube.com/watch?v=YFxsqHD6JUc&
$(() => {

    $('form').submit((event) => {
        console.log("in form submit");
        event.preventDefault();
        const collector = getUserFromForm();


        login(collector)
            .then(result => {
               setIdRedirect(result);
            }).catch(err => {
                console.log("in catch error");
                console.error(err);
                showErrorMessage(err.responseJSON.message);                
            });
    });
});


function login(collector) {
    console.log("in login function");
    return $.post(`${AUTH_URL}/login`, collector); 
}