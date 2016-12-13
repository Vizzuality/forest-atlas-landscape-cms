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

  var WidgetBlot = function (_Embed) {
    _inherits(WidgetBlot, _Embed);

    /**
     * Creates an instance of WidgetBlot.
     *
     * @param {HTMLElement} domNode
     * @param {any} value
     *
     * @memberOf WidgetBlot
     */
    function WidgetBlot(domNode, value) {
      _classCallCheck(this, WidgetBlot);

      var _this = _possibleConstructorReturn(this, (WidgetBlot.__proto__ || Object.getPrototypeOf(WidgetBlot)).call(this, domNode, value));

      _this.editor = window.editor;

      // We render the widget
      // Sample data
      // TODO: create the logic to retrieve a widget
      _this.widget = new App.View.ChartWidgetView({
        el: domNode,
        data: [{ "x": 1, "y": 28 }, { "x": 2, "y": 55 }, { "x": 3, "y": 43 }, { "x": 4, "y": 91 }, { "x": 5, "y": 81 }, { "x": 6, "y": 53 }, { "x": 7, "y": 19 }, { "x": 8, "y": 87 }, { "x": 9, "y": 52 }, { "x": 10, "y": 48 }, { "x": 11, "y": 24 }, { "x": 12, "y": 49 }, { "x": 13, "y": 87 }, { "x": 14, "y": 66 }, { "x": 15, "y": 17 }, { "x": 16, "y": 27 }, { "x": 17, "y": 68 }, { "x": 18, "y": 16 }, { "x": 19, "y": 49 }, { "x": 20, "y": 15 }],
        enableChartSelector: false
      });

      if (!_this.editor.options.readOnly) {
        // We render the toolbar
        _this._renderToolbar();
      }

      // Little trick to wait for the block to be appended to the DOM
      // before rendering the widget (which requires it)
      setTimeout(function () {
        return _this.widget.render();
      }, 0);
      return _this;
    }

    /**
     * Create the DOM node
     * @param {any} value - attributes describing the widget
     * @returns {HTMLElement} node
     */


    _createClass(WidgetBlot, [{
      key: "format",


      /**
       * Set an attribute of the node
       * @param {string} name - attribute name
       * @param {any} value
       * @memberOf WidgetBlot
       */
      value: function format(name, value) {
        _get(WidgetBlot.prototype.__proto__ || Object.getPrototypeOf(WidgetBlot.prototype), "format", this).call(this, name, value);
      }

      /**
       * Event handler called when the user clicks the remove button
       * @memberOf WidgetBlot
       */

    }, {
      key: "_onClickRemove",
      value: function _onClickRemove() {
        var offset = this.offset();
        this.editor.deleteText(offset, this.length());
        this.editor.setSelection(offset);
      }

      /**
       * Event handler called when the user clicks the change image button
       * @memberOf WidgetBlot
       */

    }, {
      key: "_onClickChange",
      value: function _onClickChange() {}

      /**
       * Render the toolbar
       * @memberOf WidgetBlot
       */

    }, {
      key: "_renderToolbar",
      value: function _renderToolbar() {
        var _this2 = this;

        // We create the element with the default state
        this.toolbar = document.createElement('div');
        this.domNode.appendChild(this.toolbar);
        this.toolbar.classList.add('toolbar');

        // We append its content
        this.toolbar.innerHTML = HandlebarsTemplates['management/wysiwyg-block-toolbar']();

        // We attach the event listeners
        this.toolbar.querySelector('.js-remove').addEventListener('click', function () {
          return _this2._onClickRemove();
        });
        this.toolbar.querySelector('.js-change').addEventListener('click', function () {
          return _this2._onClickChange();
        });
      }
    }], [{
      key: "create",
      value: function create(value) {
        var node = _get(WidgetBlot.__proto__ || Object.getPrototypeOf(WidgetBlot), "create", this).call(this);

        // We don't want the user to be able to edit the widget
        node.setAttribute('contenteditable', false);

        return node;
      }

      /**
       * Return the attributes describing the widget
       * @static
       * @param {HTMLElement} node
       * @returns {any}
       * @memberOf WidgetBlot
       */

    }, {
      key: "value",
      value: function value(node) {
        return null;
      }

      /**
       * Return the attributes attached to the node
       * @static
       * @param {HTMLElement} node
       * @returns {any}
       * @memberOf WidgetBlot
       */

    }, {
      key: "formats",
      value: function formats(node) {
        return null;
      }
    }]);

    return WidgetBlot;
  }(Embed);

  WidgetBlot.blotName = 'widget';
  WidgetBlot.tagName = 'div';
  WidgetBlot.className = '-widget';
  /* eslint-enable */

  App.Blot.WidgetBlot = WidgetBlot;
})(this.App));
