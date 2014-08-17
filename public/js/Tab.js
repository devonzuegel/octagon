var Tab = {

  init: function() {

    // Enable link to tab
    this.url = document.location.toString();

    // Show the proper tab based on the URL hash
    if(this.url.match('#')) {
      $('.nav-tabs a[href=#'+this.url.split('#')[1]+']').tab('show');
    } 

    // Change hash for page-reload
    $('.nav-tabs a').on('shown.bs.tab', function (e) {
        window.location.hash = e.target.hash;
        window.scrollTo(0, 0);
    });
  }
};