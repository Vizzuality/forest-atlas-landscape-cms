((function () {
  'use strict';

  var Embed = Quill.import('blots/block/embed');

  // IMPORTANT
  // Quill is built with ES6 classes and is transpiled with Babel. In order to extend a class
  // a Quill's class, we have to write the code using ES6 and transpile it down to ES5

  // To modify this code, please open the file with the same name and ending with the extension
  // ".js" and read how to proceed.

  /* eslint-disable */
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ImageBlot = function (_Embed) {
  _inherits(ImageBlot, _Embed);

  /**
   * Creates an instance of ImageBlot.
   *
   * @param {HTMLElement} domNode
   * @param {{ src: string }} value
   *
   * @memberOf ImageBlot
   */
  function ImageBlot(domNode, value) {
    _classCallCheck(this, ImageBlot);

    var _this = _possibleConstructorReturn(this, (ImageBlot.__proto__ || Object.getPrototypeOf(ImageBlot)).call(this, domNode, value));

    _this.image = domNode.querySelector('.js-image');
    _this.caption = domNode.querySelector('.js-caption');
    _this.editor = window.editor;

    if (!_this.editor.options.readOnly) {
      // We render the toolbar
      _this._renderToolbar();

      // We make the caption editable
      _this.caption.setAttribute('contenteditable', true);

      // We attach the listeners
      _this.image.addEventListener('mouseover', function () {
        return _this._onMouseoverImage();
      });
      _this.image.addEventListener('mouseout', function (e) {
        return _this._onMouseoutImage(e);
      });
    }
    return _this;
  }

  /**
   * Create the DOM node
   * @param {any} value - URL of the image (or base64)
   * @returns {HTMLElement} node
   */


  _createClass(ImageBlot, [{
    key: 'format',


    /**
     * Set an attribute of the node
     * @param {string} name - attribute name
     * @param {any} value
     * @memberOf ImageBlot
     */
    value: function format(name, value) {
      if (name === 'src') {
        if (value) {
          this.image.setAttribute(name, value);
        } else {
          this.image.removeAttribute(name, value);
        }
      } else if (name === 'caption') {
        if (value) {
          this.caption.textContent = value;
        } else {
          this.caption.parentElement.removeChild(this.caption);
        }
      } else if (name === 'size') {
        if (value === 'cover') {
          this.domNode.classList.add('-cover');
          this.domNode.classList.remove('-large');
        } else if (value == 'large') {
          this.domNode.classList.add('-large');
          this.domNode.classList.remove('-cover');
        } else {
          this.domNode.classList.remove('-cover');
          this.domNode.classList.remove('-large');
        }
      } else {
        _get(ImageBlot.prototype.__proto__ || Object.getPrototypeOf(ImageBlot.prototype), 'format', this).call(this, name, value);
      }
    }

    /**
     * Event handler called when the mouse is over an image
     * @memberOf ImageBlot
     */

  }, {
    key: '_onMouseoverImage',
    value: function _onMouseoverImage() {
      this._showToolbar();
    }

    /**
     * Event handler called when the mouse leaves an image
     * @param {object} e - event object
     * @memberOf ImageBlot
     */

  }, {
    key: '_onMouseoutImage',
    value: function _onMouseoutImage(e) {
      if ($(e.relatedTarget).closest(this.toolbar).length) return;
      this._hideToolbar();
    }

    /**
     * Event handler called when the mouse leaves the image toolbar
     * @param {object} e - event object
     * @memberOf ImageBlot
     */

  }, {
    key: '_onMouseoutToolbar',
    value: function _onMouseoutToolbar(e) {
      if (e.relatedTarget !== this.image && !$(e.relatedTarget).closest(this.toolbar).length) {
        this._hideToolbar();
      }
    }

    /**
     * Event handler called when the user clicks the remove button
     * @memberOf ImageBlot
     */

  }, {
    key: '_onClickRemove',
    value: function _onClickRemove() {
      var offset = this.offset();
      this.editor.deleteText(offset, this.length());
      this.editor.setSelection(offset);
    }

    /**
     * Event handler called when the user clicks the change image button
     * @memberOf ImageBlot
     */

  }, {
    key: '_onClickChange',
    value: function _onClickChange() {
      var _this2 = this;

      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.click();

      input.addEventListener('change', function () {
        var file = input.files[0];
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          _this2.format('src', reader.result);
        });
        reader.readAsDataURL(file);
      });
    }

    /**
     * Event handler called when the user clicks the toggle size button
     */

  }, {
    key: '_onClickToggleSize',
    value: function _onClickToggleSize() {
      var formats = ImageBlot.formats(this.domNode);

      switch (formats.size) {
        case 'normal':
          this.format('size', 'large');
          break;

        case 'large':
          this.format('size', 'cover');
          break;

        case 'cover':
          this.format('size', 'normal');
          break;
      }
    }

    /**
     * Hide the image toolbar
     * @memberOf ImageBlot
     */

  }, {
    key: '_hideToolbar',
    value: function _hideToolbar() {
      this.toolbar.classList.add('-hidden');
    }

    /**
     * Show the image toolbar
     * @memberOf ImageBlot
     */

  }, {
    key: '_showToolbar',
    value: function _showToolbar() {
      this.toolbar.classList.remove('-hidden');
    }

    /**
     * Render the image toolbar
     * @memberOf ImageBlot
     */

  }, {
    key: '_renderToolbar',
    value: function _renderToolbar() {
      var _this3 = this;

      // We create the element with the default state
      this.toolbar = document.createElement('div');
      this.domNode.children[0].appendChild(this.toolbar);
      this.toolbar.classList.add('toolbar');
      this._hideToolbar();

      // We append its content
      this.toolbar.innerHTML = HandlebarsTemplates['management/wysiwyg-block-toolbar']({
        showSizeBtn: true
      });

      // We attach the event listeners
      this.toolbar.addEventListener('mouseout', function (e) {
        return _this3._onMouseoutToolbar(e);
      });
      this.toolbar.querySelector('.js-remove').addEventListener('click', function () {
        return _this3._onClickRemove();
      });
      this.toolbar.querySelector('.js-change').addEventListener('click', function () {
        return _this3._onClickChange();
      });
      this.toolbar.querySelector('.js-toggle-size').addEventListener('click', function () {
        return _this3._onClickToggleSize();
      });
    }
  }], [{
    key: 'create',
    value: function create(value) {
      var node = _get(ImageBlot.__proto__ || Object.getPrototypeOf(ImageBlot), 'create', this).call(this);

      var container = document.createElement('div');
      node.appendChild(container);

      var image = document.createElement('img');
      image.classList.add('js-image');
      if (typeof value === 'string') image.setAttribute('src', value);

      container.appendChild(image);

      // We don't want the user to be able to add text within the container
      node.setAttribute('contenteditable', false);

      // We add the caption container
      var captionContainer = document.createElement('p');
      captionContainer.classList.add('caption');
      captionContainer.classList.add('js-caption');

      container.appendChild(captionContainer);

      // If we don't disable the "content editable" feature of the editor
      // when the user writes in the caption container, the browsers
      // jump to the top as it considers it as the element we're editing
      captionContainer.addEventListener('focusin', function () {
        window.editor.root.setAttribute('contenteditable', false);
      });

      captionContainer.addEventListener('focusout', function () {
        window.editor.root.setAttribute('contenteditable', true);
      });

      captionContainer.addEventListener('blur', function () {
        // If the user deleted the whole content, we want the default
        // text to appear, nevertheless a br tag is inserted so we delete it
        if (!this.textContent.length && this.innerHTML.length) {
          this.innerHTML = '';
        }
      });

      return node;
    }

    /**
     * Return the URL of the image
     * @static
     * @param {HTMLElement} node
     * @returns {string} URL
     * @memberOf ImageBlot
     */

  }, {
    key: 'value',
    value: function value(node) {
      return node.getAttribute('src');
    }

    /**
     * Return the attributes attached to the node
     * @static
     * @param {HTMLElement} node
     * @returns {{ src: string }}
     * @memberOf ImageBlot
     */

  }, {
    key: 'formats',
    value: function formats(node) {
      var format = {};

      var image = node.querySelector('.js-image');
      if (image.hasAttribute('src')) {
        format.src = image.getAttribute('src');
      }

      if (node.classList.contains('-cover')) {
        format.size = 'cover';
      } else if (node.classList.contains('-large')) {
        format.size = 'large';
      } else {
        format.size = 'normal';
      }

      var caption = node.querySelector('.js-caption');
      if (caption.textContent) {
        format.caption = caption.textContent;
      }

      return format;
    }
  }]);

  return ImageBlot;
}(Embed);

  ImageBlot.blotName = 'image';
  ImageBlot.tagName = 'div';
  ImageBlot.className = '-image';
  /* eslint-enable */

  App.Blot.ImageBlot = ImageBlot;
})(this.App));
