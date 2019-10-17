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
        var stepMethod = 'init' + this.step[0].toUpperCase() + this.step.slice(1, this.step.length).replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');}) + 'Step';
        if (this[stepMethod]) this[stepMethod]();
      }
    },

    initNameStep: function () {
      var formattedUrls = (window.gon && window.gon.global) ? gon.global.url_array : [];
      formattedUrls = formattedUrls ? formattedUrls.map(function (url) {
        return {
          url: url.host,
          id: url.id
        };
      }) : [];

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

    initSettingsStep() {
      var checkboxes = document.querySelectorAll('.js-checkboxes input[type="checkbox"]');
      var select = document.querySelector('.js-default-lang');
      var form = document.querySelector('.js-form');

      var getDefaultLang = function () {
        return select.selectedOptions[0].textContent.trim().toLowerCase();
      };

      var getCheckboxForLang = function (lang) {
        return  Array.prototype.slice.call(checkboxes).find(function (checkbox) {
          return checkbox.id === 'translate_' + lang;
        });
      };

      // When the user picks a default language for the site, we also ticks the checkbox
      // corresponding to this language to make it available as one of the target languages
      select.addEventListener('change', function (e) {
        var checkbox = getCheckboxForLang(getDefaultLang());
        if (checkbox) {
          checkbox.checked = true;
        }
      });

      // When the user submits the form, we make sure the site's default language has been enabled
      // If not, we display an error message
      form.addEventListener('submit', function (e) {
        var checkbox = getCheckboxForLang(getDefaultLang());
        if (!checkbox.checked) {
          e.preventDefault();
          App.notifications.broadcast(App.Helper.Notifications.site.defaultLanguage);
        }
      });
    },

    initTemplateStep: function () {
      var templateLabels = document.querySelectorAll('.js-template-label');
      for (var i = 0, j = templateLabels.length; i < j; i++) {
        templateLabels[i].addEventListener('keydown', function (e) {
          if (e.keyCode === 13 || e.keyCode === 32) {
            this.click();
          }
        });
      }
    },

    initStyleStep: function() {
      new App.View.ColorSelectorView({
        el: '.js-accent-color',
        title: 'Accent colour',
        colorName: 'color',
        inputId: 'accent-color',
        inputName: 'site[site_settings_attributes][0]'
      });

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

      var headerCountryColourContainer =
        document.getElementsByClassName('js-header-country-colours')[0];
      new App.View.FlagColorsView({
        el: '.js-header-country-colours',
        position: '28',
        name: 'header-country-colours',
        inputName: headerCountryColourContainer.getAttribute('input-name')
      });
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
