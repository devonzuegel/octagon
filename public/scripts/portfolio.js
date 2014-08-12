$(function(){

  // Store elements / layout variable
  var layout = 'grid',
      $container = $('.portfolio-table'),
      $change_layout = $('#change-layout');
  
  // Instantiate MixItUp with some custom options:
  $container.mixItUp({
    layout: {

      // Add the class 'list' to the container on load
      containerClass: 'grid'
    }
  });
  
  // Make our own layout changing button and bind it with a click handler
  $change_layout.on('click', function() {
    
    // If the current layout is a list
    if(layout == 'list') {

      // Change to grid
      layout = 'grid';
      
      // Update the button text
      $change_layout.html('<i class=\'fa fa-align-justify fa-right\'></i>Display as list');
      
      // Update the container class
      $container.mixItUp('changeLayout', {
        containerClass: layout
      });
      
    // If the current layout is a grid 
    } else {

      // Change to list
      layout = 'list';
      
      // Update the button text
      $change_layout.html('<i class=\'fa fa-th-large fa-right\'></i>Display as grid');
      
      // Update the container class
      $container.mixItUp('changeLayout', {
        containerClass: layout
      });
    }
  }); 
});