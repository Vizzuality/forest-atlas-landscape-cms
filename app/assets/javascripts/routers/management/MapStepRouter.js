((function (App) {
  'use strict';

  App.Router.ManagementMapStep = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
      this.pageId = params[1] || null;
    },

    index: function () {
      // We instantiate summernote for some textareas
      this.initTextAreas();

      // The following code is just for the page creation
      if (this.pageId !== null && this.pageId !== undefined) {
        return;
      }

      var versionsSelector = document.querySelector('.js-version');
      versionsSelector.addEventListener('change', function (e) {
        var version = e.target.value;
        var config = _.find(gon.map_versions, function(v) {
          return v.default_settings && v.default_settings.version === version;
        });

        if (config) {
          var values = JSON.parse(config.default_settings.settings);
          this.setDefaultValues(values);
        }
      }.bind(this));
    },

    initTextAreas: function () {
      var selector = '#map-narrative, #map-alternativeNarrative';
      $(selector).summernote({
        toolbar: [
          ['link'],
          ['style', ['bold', 'italic', 'underline', 'clear']],
          ['font', ['strikethrough', 'superscript', 'subscript']],
          ['para', ['ul', 'ol', 'paragraph']],
        ]
      });
    },

    setDefaultValues: function (values) {
      var form = document.querySelector('.js-form');
      var keys = Object.keys(values);

      keys.forEach(function (key) {
        var input = form.querySelector('[name="map-' + key + '"]');
        if (input) {
          if (input.tagName === 'INPUT') {
            if (input.type === 'text') {
              input.value = values[key];
            } else if (input.type === 'hidden') {
              // We assume it's an input associated with a checkbox
              var sibling = input.nextElementSibling;
              if (sibling && sibling.matches('input[type="checkbox"]')) {
                sibling.checked = !!values[key];
              } else {
                // We assume it's a field with a JSONEditor instance
                if (sibling.editor) {
                  sibling.input.value = JSON.stringify(values[key]);
                  sibling.editor.set(values[key]);
                }
              }
            }
          } else if (input.tagName === 'TEXTAREA') {
            try {
              $(input).summernote('reset');
              $(input).summernote('insertText', values[key]);
            } catch (e) {
              console.error(e);
            }
          } else if (input.tagName === 'SELECT') {
            var selectedIndex = _.findIndex(input.options, { value: values[key] });
            if (selectedIndex !== -1) {
              input.selectedIndex = selectedIndex;
            }
          }
        }
      });

      // this.initTextAreas();
    }

  });
})(this.App));
