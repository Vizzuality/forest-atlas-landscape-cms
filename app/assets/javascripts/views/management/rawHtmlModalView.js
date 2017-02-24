((function (App) {
  'use strict';

  App.View.RawHtmlModalView = Backbone.View.extend({
    className: 'c-raw-html-modal',
    template: HandlebarsTemplates['management/raw-html-modal'],

    defaults: {
      // Callback executed when the user clicks the cancel button
      cancelCallback: function () {},
      // Callback executed when the user clicks the continue button
      continueCallback: function () {}

    },

    events: {
      'click .js-cancel': '_onClickCancel',
      'click .js-continue': '_onClickContinue'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);

      this.render = this.render.bind(this);
    },

    /**
     * Event handler executed when the cancel button is clicked
     */
    _onClickCancel: function () {
      this.options.cancelCallback();
    },

    /**
     * Event handler executed when the continue button is clicked
     * @param {Event} e - even
     */
    _onClickContinue: function (e) {
      e.preventDefault();

      var content = this.editor.getValue();
      this.options.continueCallback(content);
    },

    _renderEditor: function () {
      var container = this.el.querySelector('.js-raw-html');

      this.editor = CodeMirror.fromTextArea(container, { mode : "xml", htmlMode: true, autoCloseTags: true });
    },

    render: function () {
      this.el.innerHTML = this.template();
      this.setElement(this.el);

      return this;
    },

    afterRender: function () {
      this._renderEditor();
    }

  });

})(this.App));
