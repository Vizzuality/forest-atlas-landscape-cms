((function () {
  'use strict';

  SirTrevor.Blocks.Image = SirTrevor.Block.extend({

    type: 'image',
    icon_name: 'image',
    droppable: true,
    uploadable: true,

    validFileTypes: ['jpg', 'jpeg', 'png', 'gif'],

    /**
     * Return true if the type is valid
     * @param {string} type
     * @returns {boolean}
     */
    isValidFileType: function (type) {
      var extension = type.match(/image\/(.+)$/);
      return extension && extension.length && this.validFileTypes.indexOf(extension[1]) !== -1;
    },

    getContent: function () {
      return this.inner.querySelector('.js-content');
    },

    /**
     * Hide the interface to upload an image, and display the image passed as argument
     * @param {string} base64 base64 string representing the image
     */
    displayImage: function (base64) {
      this.editor.innerHTML = '<img src="' + base64 + '" class="image" />';
      this.inputs.style.display = 'none';
      this.editor.style.display = 'block';
    },

    onDrop: function (input) {
      var file = input.files[0];

      if (!file) return;

      if (!this.isValidFileType(file.type)) {
        // eslint-disable-next-line no-alert
        this.addMessage('Only the following file types are accepted: ' + this.validFileTypes.join(', '));
        return;
      }

      this.loading();

      var reader = new FileReader();

      reader.addEventListener('load', function () {
        this.displayImage(reader.result);
        this.ready();
      }.bind(this));

      reader.addEventListener('error', function () {
        this.addMessage('Unable to load the image');
      }.bind(this));

      reader.readAsDataURL(file);
    },

    loadData: function (data) {
      this.editor.innerHTML = data.text;
    },

    _serializeData: function () {
      return {
        format: 'html',
        text: this.editor.innerHTML
      };
    },

    toggleEmptyClass: function () {
      this.getContent().classList.toggle('-empty', this.isEmpty());
    },

    isEmpty: function () {
      return true;
    }

  });
})(this.App));
