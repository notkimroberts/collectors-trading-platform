// Create a JSON object with each of your navigation items
var navigation = {
    'navItems' : [
      {
        'navTitle' : 'Style Guide',
        'navLink' : '/style-guide/index.html'
      }
    ]
  };
  
  // Pass the JSON object to your nav.handlebars template
  var navTemplate = Handlebars.templates.nav(navigation);
  
  // Prepend the navigation markup to the body element
  $('body').prepend(navTemplate);