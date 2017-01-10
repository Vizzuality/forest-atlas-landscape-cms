((function (App) {

  'use strict';

  Parsley
    .addValidator('json', {
      requirementType: 'string',
      validateString: function(value) {
        var isValid = true;
        try {
          JSON.parse(value);
        } catch(e) {
          if (e) {
            isValid = false;
          }
        }
        return isValid;
      },
      messages: {
        en: 'This value should be a valid JSON'
      }
    });

  App.View.Form = Backbone.View.extend({

    defaults: {},

    initialize: function(settings) {
      this.options = Object.assign({}, this.defaults, settings);
      if (this.$el.length === 0) return;
      this.addingValidation();
    },

    /**
     * Adding custom and rich validations using Parsley library
     * @see http://parsleyjs.org/doc/index.html
     */
    addingValidation: function() {
      this.$el.parsley();
    }

  });

})(this.App));
