$(function(){

  var layout = 'list', // Store the current layout as a variable
      $container = $('.portfolio-table'), // Cache the MixItUp container
      $change_layout = $('#change-layout'); // Cache the changeLayout button
  
  // Instantiate MixItUp with some custom options:
  
  $container.mixItUp({
    layout: {
      containerClass: 'list' // Add the class 'list' to the container on load
    }
  });
  
  // MixItUp does not provide a default "change layout" button
  // so we need to make our own and bind it with a click handler:
  
  $change_layout.on('click', function(){
    
    // If the current layout is a list, change to grid:
    
    if(layout == 'list'){
      layout = 'grid';
      
      $change_layout.html('<i class=\'fa fa-align-justify fa-right\'></i>Display as list'); // Update the button text
      
      $container.mixItUp('changeLayout', {
        containerClass: layout // change the container class to "grid"
      });
      
    // Else if the current layout is a grid, change to list:  
    } else {
      layout = 'list';
      
      $change_layout.html('<i class=\'fa fa-th-large fa-right\'></i>Display as grid'); // Update the button text
      
      $container.mixItUp('changeLayout', {
        containerClass: layout // Change the container class to 'list'
      });
    }
  });
  
});