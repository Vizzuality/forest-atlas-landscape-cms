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

  var HtmlBlot = function (_Embed) {
    _inherits(HtmlBlot, _Embed);

    /**
     * Creates an instance of HtmlBlot.
     *
     * @param {HTMLElement} domNode
     * @param {String} rawContent
     * @memberOf HtmlBlot
     */
    function HtmlBlot(domNode, rawContent) {
      _classCallCheck(this, HtmlBlot);

      var _this = _possibleConstructorReturn(this, (HtmlBlot.__proto__ || Object.getPrototypeOf(HtmlBlot)).call(this, domNode));

      _this.editor = window.editor;
      _this.content = domNode.querySelector('.js-raw-html-content');
      _this.content.setAttribute('contenteditable', false);
      _this.content.innerHTML = rawContent;

      if (!_this.editor.options.readOnly) {
        // We render the toolbar
        _this._renderToolbar();
      }
      return _this;
    }

    /**
     * Create the DOM node
     * @returns {HTMLElement} node
     */


    _createClass(HtmlBlot, [{
      key: 'format',


      /**
       * Set an attribute of the node
       * @param {string} name - attribute name
       * @param {any} value
       * @memberOf HtmlBlot
       */
      value: function format(name, value) {
        if (name === 'content') {
          if (value) {
            this.content.innerHTML = value;
          } else {
            this.content.parentElement.removeChild(this.caption);
          }
        } else {
          _get(HtmlBlot.prototype.__proto__ || Object.getPrototypeOf(HtmlBlot.prototype), 'format', this).call(this, name, value);
        }
      }

      /**
       * Event handler called when the user clicks the remove button
       * @memberOf HtmlBlot
       */

    }, {
      key: '_onClickRemove',
      value: function _onClickRemove() {
        var offset = this.offset();
        this.editor.deleteText(offset, this.length());
        this.editor.setSelection(offset);
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
       * Render the toolbar
       * @memberOf HtmlBlot
       */

    }, {
      key: '_renderToolbar',
      value: function _renderToolbar() {
        var _this2 = this;

        // We create the element with the default state
        this.toolbar = document.createElement('div');
        this.domNode.children[0].appendChild(this.toolbar);
        this.toolbar.classList.add('toolbar');

        // We append its content
        this.toolbar.innerHTML = HandlebarsTemplates['management/wysiwyg-block-toolbar']({
          hideChangeBtn: false,
          showSizeBtn: false
        });

        // We attach the event listeners
        this.content.addEventListener('mouseover', function () {
          return _this2._onMouseoverImage();
        });
        this.content.addEventListener('mouseout', function (e) {
          return _this2._onMouseoutToolbar(e);
        });
        this.toolbar.querySelector('.js-remove').addEventListener('click', function () {
          return _this2._onClickRemove();
        });
      }
    }], [{
      key: 'create',
      value: function create() {
        var node = _get(HtmlBlot.__proto__ || Object.getPrototypeOf(HtmlBlot), 'create', this).call(this);
        var container = document.createElement('div');

        container.classList.add('js-raw-html-content');
        node.appendChild(container);

        return node;
      }

      /**
       * Return the attributes attached to the node
       * @static
       * @param {HTMLElement} node
       * @returns {any}
       * @memberOf HtmlBlot
       */

    }, {
      key: 'formats',
      value: function formats(node) {
        var res = {};

        var content = node.querySelector('.js-raw-html-content');
        if (content && content.innerHTML) {
          res.content = content.innerHTML;
        }

        return res;
      }
    }]);

    return HtmlBlot;
  }(Embed);

  HtmlBlot.blotName = 'html';
  HtmlBlot.tagName = 'div';
  HtmlBlot.className = '-raw-html';
/* eslint-enable */

  App.Blot.HtmlBlot = HtmlBlot;
})(this.App));
