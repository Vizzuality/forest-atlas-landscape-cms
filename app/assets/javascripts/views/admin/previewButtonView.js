// = require ../../channels/preview

((function (App) {
  'use strict';

  App.View.PreviewButtonView = Backbone.View.extend({
    template: HandlebarsTemplates['admin/preview-button'],

    defaults: {
      siteSlug: null,
      compiling: false
    },

    events: {
      'click .preview-button': '_startCompiling'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);

      //App.Cable

      this.render();
    },

    /**
     * Event handler executed when the user clicks the add URL button
     */
    _startCompiling: function () {
      this.options.compiling = true;

      const vm = this;
      $.get(
        `${window.gon.global.api_url}/admin/sites/${this.options.siteSlug}/preview/compile`,
        {site_settings: this._variables()},
        function( data ) {
          vm.options.compiling = true;

          vm.render();
        }
      );
    },

    _variables: function() {
      const color = document.querySelector('#accent-color_id').value;
      const contentWidth = document.querySelector('#content_width').value;
      const contentFont = document.querySelector('#content_font').value;
      const headingFont = document.querySelector('#heading_font').value;
      const coverSize = document.querySelector('#cover_size').value;
      const coverTextAlignment = document.querySelector('#cover_text_alignment').value;
      const headerSeparators = document.querySelector('#header_separators').value;
      const headerBackground = document.querySelector('#header_background').value;
      const headerTransparency = document.querySelector('#header_transparency').value;
      const headerLoginEnabled = document.querySelector('#header_login_enabled').value;
      const footerBackground = document.querySelector('#footer_background').value;
      const footerTextColor = document.querySelector('#footer_text_color').value;
      const footerLinksColor = document.querySelector('#footer-links-color').value;

      let headerCountryColours = '';
      const countryColoursSelectors = document.querySelectorAll('.country-colors-container input[type="color"]');
      for (let i=0; i < countryColoursSelectors.length; i++) {
        headerCountryColours += `${countryColoursSelectors[i].value} `;
      }
      
      return {
        color: color,
        content_width: contentWidth,
        content_font: contentFont,
        heading_font: headingFont,
        cover_size: coverSize,
        cover_text_alignment: coverTextAlignment,
        header_separators: headerSeparators,
        header_background: headerBackground,
        header_transparency: headerTransparency,
        header_login_enabled: headerLoginEnabled,
        footer_background: footerBackground,
        footer_text_color: footerTextColor,
        footer_links_color: footerLinksColor,
        'header-country-colours': headerCountryColours
      };
    },

    _finished: function() {
      this.options.compiling = false;
    },

    render: function () {
      this.$el.html(this.template({
        compiling: this.options.compiling,
      }));
    }
  });
})(this.App));

