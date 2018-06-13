(function (App) {
  'use strict';
  // We instantiate the Quick links component
  new App.View.QuickLinksView({
    activeLink: 'admin'
  });

  // We instantiate the User links component
  new App.View.UserLinksView();
}).call(this, this.App);
