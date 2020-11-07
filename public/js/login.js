

$(() => {

    $('form').submit((event) => {
        event.preventDefault();
        const collector = getUserFromForm();


        login(collector)
            .then(result => {
                setIdRedirect(result);
            }).catch(error => {
                console.error(error);
                showErrorMessage(error.responseJSON.message);


                
            });
    });
});


function login(collector) {

  
  return $.post(`${AUTH_URL}/login`, collector); 
}