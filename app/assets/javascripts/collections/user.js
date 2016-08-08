
(function(App) {

  'use strict';

  App.Collection.User = App.Collection.Table.extend({

    url: 'admin/users.json'

  });

})(this.App);
