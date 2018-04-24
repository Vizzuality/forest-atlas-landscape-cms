((function (App) {
  'use strict';

  App.View.UrlsInputView = Backbone.View.extend({
    className: 'c-urls-input',
    template: HandlebarsTemplates['admin/urls-input'],

    defaults: {
      showNextInput: false
    },

    events: {
      'click .js-add-url': '_addUrl',
      'click .js-remove-url': '_removeUrl',
      'blur .js-input': '_updateUrl'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      this.render();
    },

    /**
     * Event handler executed when the user clicks the add URL button
     */
    _addUrl: function () {
      this.options.showNextInput = true;
      this.render();
    },

    /**
     * Event hanlder executed when the user removes a URL
     * @param {Event} e - event
     */
    _removeUrl: function (e) {
      if (this._canRemoveUrl()) {
        var index = +e.target.dataset.id;
        var model = this.collection.at(index);
        this.collection.remove(model);
        this.options.showNextInput = false;
        this.render();
      }
    },

    /**
     * Event handler executed when an URL input is blurred
     * @param {Event} e - event
     */
    _updateUrl: function (e) {
      var input = e.target;
      var position = input.dataset ? +input.dataset.id : this.collection.length;
      var model = this.collection.at(position);

      if (!model) {
        if (input.value.length) this.collection.push({ url: input.value });
      } else {
        model.set({ url: input.value });
      }
    },

    /**
     * Return whether the user can delete a URL input
     * @returns {boolean}
     */
    _canRemoveUrl: function () {
      return (this.collection.length > 0);
    },

    render: function () {
      // We add the component's class name to the element
      this.$el.addClass(this.className);

      // We remove all of the previous rendered nodes
      var children = Array.prototype.slice.apply(this.$el[0].children);
      for (var i = 1, j = children.length; i < j; i++) {
        this.$el[0].removeChild(children[i]);
      }

      this.$el.append(this.template({
        showNextInput: this.options.showNextInput,
        urls: this.collection.toJSON(),
        inputId: (window.gon && gon.global && gon.global.url_controller_id) || '',
        inputName: (window.gon && gon.global && gon.global.url_controller_name) || ''
      }));
      this.setElement(this.el);
    }
  });
})(this.App));
