var Portfolio = {

  // Initialize object
  init: function() {

    // Save element references
    this.elements = {
      // subToolbar: $('.portfolio-sub-toolbar'),
      container: $('.portfolio-table'),
      layoutGridBtn: $('#layout-grid-btn'),
      layoutListBtn: $('#layout-list-btn')
    };

    // Save current layout
    this.layout = 'grid';

    // Initialize mixItUp
    this.elements.container.mixItUp({
      layout: {
        containerClass: Portfolio.layout
      }
    });

    // Handle click of layout btns
    this.elements.layoutGridBtn.on('click', this.changeToGrid);
    this.elements.layoutListBtn.on('click', this.changeToList);
  },

  // Change to grid layout
  changeToGrid: function() {

    // Hide sub toolbar
    // Portfolio.elements.subToolbar.hide();

    // Change current layout
    Portfolio.layout = 'grid';

    // Add/remove classes
    Portfolio.elements.layoutGridBtn.addClass('active');
    Portfolio.elements.layoutListBtn.removeClass('active'); 

    // Reinitialize mixItUp
    Portfolio.elements.container.mixItUp('changeLayout', {
      containerClass: Portfolio.layout
    });
  },

  // Change to list layout
  changeToList: function() {

    // Show sub toolbar
    // Portfolio.elements.subToolbar.show();

    // Change current layout
    Portfolio.layout = 'list';

    // Add/remove classes
    Portfolio.elements.layoutGridBtn.removeClass('active');
    Portfolio.elements.layoutListBtn.addClass('active'); 

    // Reinitialize mixItUp
    Portfolio.elements.container.mixItUp('changeLayout', {
      containerClass: Portfolio.layout
    });
  }
};