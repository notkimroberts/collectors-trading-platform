$(() => {

    $('form').submit((event) => {
        console.log("in form submit");
        event.preventDefault();
        const collector = getUserFromForm();


        login(collector)
            .then(result => {
                console.log("hi");
                console.log(result); 
               //setIdRedirect(result);
            }).catch(error => {
                console.log("in catch error");
                console.error(error);
                showErrorMessage(error.responseJSON.message);                
            });
    });
});


function login(collector) {
    console.log("in login function");
    return $.post(`${AUTH_URL}/login`, collector); 
}