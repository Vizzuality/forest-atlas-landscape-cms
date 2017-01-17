((function (App) {
  'use strict';

  App.View.ModalView = Backbone.View.extend({
    className: 'c-modal',

    events: {
      'click': '_onClickOverlay',
      'click .js-close': 'close'
    },

    initialize: function () {
      this._initModal();
    },

    /**
     * Event handler called when the container is propagated a click events
     * @param {object} e - event object
     */
    _onClickOverlay: function (e) {
      if (e.target === e.currentTarget) this.close();
    },

    /**
     * Init the modal before rendering it
     */
    _initModal: function () {
      this.close();
      document.body.appendChild(this.el);
      this.el.innerHTML = '\
        <div class="container">\
          <button type="button" class="close-button js-close" title="Close">\
            <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path fill="#555" d="M2.183 0L0 2.183l4.438 4.438-4.354 4.354 2.183 2.183 4.354-4.353 4.269 4.268 2.183-2.183-4.27-4.27 4.354-4.353L10.974.085 6.621 4.438z" fill-rule="evenodd"/></svg>\
          </button>\
          <div class="content js-content">\
          </div>\
        </div>\
      ';

      this.contentContainer = this.el.querySelector('.js-content');
    },

    /**
     * Open the modal
     */
    open: function () {
      var renderRes = this.render();

      if (renderRes instanceof Backbone.View) {
        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(renderRes.el);
        if (renderRes.afterRender) renderRes.afterRender();
      } else {
        this.contentContainer.innerHTML = renderRes;
      }

      this.el.classList.remove('-hidden');
    },

    /**
     * Close the modal
     */
    close: function () {
      this.el.classList.add('-hidden');
    },

    /**
     * Render the content of the modal
     * NOTE: to be overriden
     * @returns {string|object} HTML string or Backbone view
     */
    render: function () {
      return '';
    }
  });
})(this.App));
