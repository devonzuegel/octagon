// Object literal for handling a portfolio
var Portfolio = {

  // Initialize object
  init: function() {

    this.elements = {
      container: $('.portfolio-table'),
      layoutGridBtn: $('#layout-grid-btn'),
      layoutListBtn: $('#layout-list-btn')
    };

    this.layout = 'grid';

    this.elements.container.mixItUp({
      layout: {
        containerClass: Portfolio.layout
      }
    });

    this.elements.layoutGridBtn.on('click', this.changeToGrid);

    this.elements.layoutListBtn.on('click', this.changeToList);
  },

  changeToGrid: function() {
    Portfolio.layout = 'grid';

    Portfolio.elements.layoutGridBtn.addClass('active');
    Portfolio.elements.layoutListBtn.removeClass('active'); 

    Portfolio.elements.container.mixItUp('changeLayout', {
      containerClass: Portfolio.layout
    });
  },

  changeToList: function() {
    Portfolio.layout = 'list';

    Portfolio.elements.layoutGridBtn.removeClass('active');
    Portfolio.elements.layoutListBtn.addClass('active'); 

    Portfolio.elements.container.mixItUp('changeLayout', {
      containerClass: Portfolio.layout
    });
  }
};