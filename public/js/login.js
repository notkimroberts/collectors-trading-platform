/* const { error } = require("jquery"); */
// https://www.youtube.com/watch?v=YFxsqHD6JUc&
$(() => {

    $('form').submit((event) => {
        event.preventDefault();
        const collector = getUserFromForm();
        console.log("HI");


        login(collector)
            .then(result => {
               setIdRedirect(result);
               console.log(result);
            }).catch(err => {
                console.error(err);
                showErrorMessage(err.responseJSON.message);                
            });
    });
});


function login(collector) {
    return $.post(`${AUTH_URL}/login`, collector); 
}