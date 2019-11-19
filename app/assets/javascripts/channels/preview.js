(function() {
  App.preview = App.Cable.subscriptions.create("PreviewChannel", {
    connected: function() { },
    disconnected: function() { },
    received: function(data) {
      if (data['finish']) {
        // Unblock preview button (data['site_id'])
       document.querySelector('.preview-button').trigger('finished');
      }
    }
  });

}).call(this);
