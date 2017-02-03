((function (App) {
  'use strict';

  App.Router.AdminSiteCreation = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.step = params[0] || null;
    },

    index: function () {
      // We execute the code specific to the step
      if (this.step && this.step.length) {
        var stepMethod = 'init' + this.step[0].toUpperCase() + this.step.slice(1, this.step.length) + 'Step';
        if (this[stepMethod]) this[stepMethod]();
      }
    },

    initNameStep: function () {
      var formattedUrls = (window.gon && window.gon.global) ? gon.global.urlArray : [];
      formattedUrls = formattedUrls.map(function (url) {
        return {
          url: url.host,
          id: url.id
        };
      });

      new App.View.UrlsInputView({
        el: '.js-urls',
        collection: new Backbone.Collection(formattedUrls)
      });
    },

    initSettingsStep: function () {
      var fileInputs = document.querySelectorAll('input[type="file"]');
      // eslint-disable-next-line block-scoped-var
      for (var i = 0, j = fileInputs.length; i < j; i++) {
        fileInputs[i].addEventListener('change', this._onChangeFileInput.bind(this));  // eslint-disable-line block-scoped-var
      }

      var labels = document.querySelectorAll('input[type="file"] + label');
      // eslint-disable-next-line block-scoped-var, no-redeclare
      for (var i = 0, j = labels.length; i < j; i++) {
        labels[i].addEventListener('keydown', function (e) { // eslint-disable-line block-scoped-var
          // Space key and enter key
          if (e.keyCode === 13 || e.keyCode === 32) {
            this.click();
          }
        });
      }

      new App.View.FlagColorsView({ el: '.js-flag-colors' });
    },

    /**
     * Event handler executed when a file input is "changed"
     * @param {Event} e - event
     */
    _onChangeFileInput: function (e) {
      var input = e.currentTarget;
      var imageType = input.dataset.type;
      var container = input.parentElement;
      var placeholder = container.querySelector('.js-placeholder');
      var restrictions = container.querySelector('.js-restrictions');
      var oldPreview = container.querySelector('.js-preview');
      var isHigh = (placeholder && placeholder.classList.contains('-high')) ||
        (oldPreview && oldPreview.classList.contains('-high'));
      // If you update this limit, please also update the notification and the rails view
      var maxFileSize = 1024 * 1024;

      // We retrieve the image
      var file = input.files[0];
      if (file.size > maxFileSize) {
        App.notifications.broadcast(App.Helper.Notifications.site.maxFileSize);
        return;
      }

      var reader = new FileReader();
      reader.addEventListener('load', function () {
        var base64 = reader.result;

        // We remove the placeholder
        if (placeholder) container.removeChild(placeholder);

        // We remove the preview
        if (oldPreview) container.removeChild(oldPreview);

        // We add the preview image
        var preview = document.createElement('div');
        preview.classList.add('preview', 'js-preview');
        if (isHigh) preview.classList.add('-high');

        if (imageType === 'image') {
          var image = document.createElement('img');
          image.src = base64;
          preview.appendChild(image);
        } else {
          preview.style.backgroundImage = 'url(' + base64 + ')';
        }

        container.insertBefore(preview, restrictions);
      });
      reader.readAsDataURL(file);
    }
  });
})(this.App));
