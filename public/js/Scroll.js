var Scroll = {

  // Initialize scroll object
  init: function() {

    // Store elements to be handled
    this.elements = {
      portfolioToolbar: $('.portfolio-toolbar'),
      companyNavbar: $('.company-navbar')
    };

    // Store distances to be saved
    this.distances = {
      portfolioDist: 50,
      companyDist: 300
    };

    // Position elements on page load
    Scroll.positionElement(
      this.elements.portfolioToolbar,
      this.distances.portfolioDist);
    Scroll.positionElement(
      this.elements.companyNavbar,
      this.distances.companyDist);

    // On scroll, position elements
    $(window).scroll(function() {
      Scroll.positionElement(
        Scroll.elements.portfolioToolbar,
        Scroll.distances.portfolioDist);
      Scroll.positionElement(
        Scroll.elements.companyNavbar,
        Scroll.distances.companyDist);
    });
  },

  // Given an element and a distance, set the property of an object
  positionElement: function(elem, dist) {

    if(elem.length && $(window).scrollTop() >= dist) {
      elem.addClass('top-fixed');
    } else {
      elem.removeClass('top-fixed');
    }
  }

};