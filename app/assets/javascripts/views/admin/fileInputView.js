((function (App) {
  'use strict';

  App.View.FileInputView = Backbone.View.extend({

    defaults: {
      label: 'Select file'
    },

    events: {
      'click .js-fake-input': '_onClickFakeInput',
      'change input[type="file"]': '_onChangeFileInput'
    },

    initialize: function (settings) {
      this.options = $.extend(true, {}, this.defaults, settings);
      this.fileInput = this.el.querySelector('input[type="file"]');
      this.render();
    },

    _onClickFakeInput: function () {
      this.fileInput.click();
    },

    _onChangeFileInput: function () {
      var path = this.fileInput.value;
      var fileName = path.split('\\')[path.split('\\').length - 1];
      this.fakeInput.placeholder = fileName;
    },

    /**
     * Delete all the nodes of the container except the original file input
     * This is used to make sure we don't dulicate elements by rendering several times
     */
    _cleanContainer: function () {
      var containerChildren = Array.prototype.slice.call(this.el.children);
      for (var i = 0, j = containerChildren.length; i < j; i++) {
        var child = containerChildren[i];
        if (!child.matches('input[type="file"]')) {
          this.el.removeChild(child);
        }
      }
    },

    render: function () {
      this._cleanContainer();

      // We make the file input invisible
      this.fileInput.style.display = 'none';

      // We append a new input faking the file one
      this.fakeInput = document.createElement('input');
      this.fakeInput.type = 'input';
      this.fakeInput.placeholder = this.options.label;
      this.fakeInput.readOnly = true;
      this.fakeInput.classList.add('js-fake-input');
      this.el.insertBefore(this.fakeInput, this.fileInput);

      this.setElement(this.el);
    }
  });
})(this.App));
