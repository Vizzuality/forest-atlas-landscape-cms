((function (App) {
  'use strict';

  App.Router.AdminSiteEdition = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.siteSlug = params[0] || null;
      this.step = (params.length > 1 && params[1]) || null;
    },

    index: function () {
      // We execute the code specific to the step
      if (this.step && this.step.length) {
        var stepMethod = 'init' + this.step[0].toUpperCase() + this.step.slice(1, this.step.length).replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');}) + 'Step';
        if (this[stepMethod]) this[stepMethod]();
      }
    },

    initNameStep: function () {
      var formattedUrls = (window.gon && window.gon.global) ? gon.global.url_array : [];
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

    initContextsStep: function () {
      // If the user sets as context by default a context that isn't selected, then we
      // select it
      var defaultContexts = document.querySelectorAll('.js-default-context');
      Array.prototype.slice.call(defaultContexts).forEach(function (defaultContext) {
        defaultContext.addEventListener('click', function (e) {
          var card = $(e.currentTarget).closest('.js-card')[0];
          var context = card.querySelector('.js-context');
          var isChecked = context.checked;
          if (!isChecked) context.checked = true;
        });
      });

      // If the user tries to unselect a context set as default, then we prevent them to
      // do so and display a warning
      var contexts = document.querySelectorAll('.js-context');
      Array.prototype.slice.call(contexts).forEach(function (context) {
        context.addEventListener('click', function (e) {
          if (e.currentTarget.checked) return;
          var card = $(e.currentTarget).closest('.js-card')[0];
          var isDefault = !!card.querySelector('.js-default-context:checked');
          if (isDefault) {
            App.notifications.broadcast(App.Helper.Notifications.site.deselectContext);
            e.preventDefault();
          }
        });
      });
    },

    initTemplateStep: function () {
      var themeColorContainer = document.querySelector('.js-theme-color');
      var input = themeColorContainer.querySelector('input');
      var colorLabel = themeColorContainer.querySelector('.js-label');
      var preview = themeColorContainer.querySelector('.js-preview');

      // We initialize the preview with the saved color
      preview.style.backgroundColor = input.value;

      input.addEventListener('change', function () {
        preview.style.backgroundColor = input.value;
      });

      colorLabel.addEventListener('keydown', function (e) {
        if (e.keyCode === 13 || e.keyCode === 32) {
          this.click();
        }
      });

      var templateLabels = document.querySelectorAll('.js-template-label');
      for (var i = 0, j = templateLabels.length; i < j; i++) {
        templateLabels[i].addEventListener('keydown', function (e) {
          if (e.keyCode === 13 || e.keyCode === 32) {
            this.click();
          }
        });
      }
    },

    initStyleStep: function () {
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
      var fileInputFooter = container.querySelector('.js-restrictions').parentElement;
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
        preview.classList.add('preview');
        preview.classList.add('js-preview');
        if (isHigh) preview.classList.add('-high');

        if (imageType === 'image') {
          var image = document.createElement('img');
          image.src = base64;
          preview.appendChild(image);
        } else {
          preview.style.backgroundImage = 'url(' + base64 + ')';
        }

        container.insertBefore(preview, fileInputFooter);
      });
      reader.readAsDataURL(file);
    }
  });
})(this.App));
