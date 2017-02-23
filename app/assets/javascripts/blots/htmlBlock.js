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
     *
     * @memberOf HtmlBlot
     */
    function HtmlBlot(domNode) {
      _classCallCheck(this, HtmlBlot);

      var _this = _possibleConstructorReturn(this, (HtmlBlot.__proto__ || Object.getPrototypeOf(HtmlBlot)).call(this, domNode));

      _this.htmlContainer = domNode.querySelector('.js-html-container');
      _this.editor = window.editor;

      if (!_this.editor.options.readOnly) {
        // We render the toolbar
        _this._renderToolbar();

        // We make the htmlContainer editable
        _this.htmlContainer.setAttribute('contenteditable', true);
      }
      return _this;
    }

    /**
     * Create the DOM node
     * @returns {HTMLElement} node
     */


    _createClass(HtmlBlot, [{
      key: '_onClickRemove',


      /**
       * Event handler called when the user clicks the remove button
       * @memberOf HtmlBlot
       */
      value: function _onClickRemove() {
        var offset = this.offset();
        this.editor.deleteText(offset, this.length());
        this.editor.setSelection(offset);
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
        this.domNode.appendChild(this.toolbar);
        this.toolbar.classList.add('toolbar');

        // We append its content
        this.toolbar.innerHTML = HandlebarsTemplates['management/wysiwyg-block-toolbar']({
          hideChangeBtn: true,
          showSizeBtn: true
        });

        // We attach the event listeners
        this.toolbar.querySelector('.js-remove').addEventListener('click', function () {
          return _this2._onClickRemove();
        });
      }
    }], [{
      key: 'create',
      value: function create() {
        var node = _get(HtmlBlot.__proto__ || Object.getPrototypeOf(HtmlBlot), 'create', this).call(this);

        var container = document.createElement('textarea');
        container.classList.add('html-container', 'js-html-container');
        node.appendChild(container);

        // If we don't disable the "content editable" feature of the editor
        // when the user writes in the caption container, the browsers
        // jump to the top as it considers it as the element we're editing
        container.addEventListener('focusin', function () {
          window.editor.root.setAttribute('contenteditable', false);
        });

        container.addEventListener('focusout', function () {
          window.editor.root.setAttribute('contenteditable', true);
        });

        return node;
      }
    }]);

    return HtmlBlot;
  }(Embed);

  HtmlBlot.blotName = 'html';
  HtmlBlot.tagName = 'code';
  HtmlBlot.className = '-raw-html';
/* eslint-enable */

  App.Blot.HtmlBlot = HtmlBlot;
})(this.App));
