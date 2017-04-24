((function () {
  'use strict';

  var Embed = Quill.import('blots/block/embed');

  // IMPORTANT
  // Quill is built with ES6 classes and is transpiled with Babel. In order to extend a class
  // a Quill's class, we have to write the code using ES6 and transpile it down to ES5

  // To modify this code, please open the file with the same name and ending with the extension
  // ".js" and read how to proceed.

  /* eslint-disable */
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
    _this.caption = domNode.querySelector('.js-caption');
    _this.widgetContainer = domNode.querySelector('.js-widget-container');

    if (!_this.editor.options.readOnly) {
      // We make the caption editable
      _this.caption.setAttribute('contenteditable', true);
    }

    _this.widgetContainer.innerHTML = '<div class="c-loading-spinner"></div>';

    _this._fetchWidget().done(function () {
      _this._initWidget();

      // If wanted, we set the widget's description as default text
      // of the caption
      if (_this.caption.dataset.defaultCaption) {
        _this.caption.textContent = _this.model.toJSON().description;
      }
    }).fail(function () {
      if (!this.editor.options.readOnly) {
        App.notifications.broadcast(App.Helper.Notifications.page.widgetError);
        this._onClickRemove();
      } else {
        App.notifications.broadcast(App.Helper.Notifications.widget.loadingWarning);
      }

      this.widgetContainer.innerHTML = '<p class="error">This widget couldn\'t be loaded properly</p>';
    }.bind(_this));
    return _this;
  }

  /**
   * Fetch the data associated to the widget
   * @returns {any} jQuery deferred object
   */


  _createClass(WidgetBlot, [{
    key: '_fetchWidget',
    value: function _fetchWidget() {
      var id = WidgetBlot.value(this.domNode).id;

      var url = '/widget_data.json?widget_id=' + id;
      if (this.editor.options.readOnly) {
        url = window.location.origin + url;
      } else {
        url = window.location.pathname + url;
      }

      this.model = new (Backbone.Model.extend({
        url: url
      }))();

      return this.model.fetch();
    }

    /**
     * Init the widget
     */

  }, {
    key: '_initWidget',
    value: function _initWidget() {
      var _this2 = this;

      var chart = this.model.toJSON();

      // We retrieve the chart's configuration
      var config;
      try {
        config = JSON.parse(chart.visualization);
      } catch (e) {
        config = {
          chart: null,
          x: null,
          y: null,
          xLabel: null,
          yLabel: null,
        };
      }

      // We render the widget
      this.widget = new App.View.ChartWidgetView({
        el: this.domNode.querySelector('.js-widget-container'),
        data: chart.data,
        chart: config.chart,
        columnX: config.x,
        columnY: config.y,
        xLabel: config.xLabel,
        yLabel: config.yLabel,
        enableChartSelector: false
      });

      if (!this.editor.options.readOnly) {
        // We render the toolbar
        this._renderToolbar();
      }

      // Little trick to wait for the block to be appended to the DOM
      // before rendering the widget (which requires it)
      setTimeout(function () {
        return _this2.widget.render();
      }, 0);
    }

    /**
     * Create the DOM node
     * @param {any} obj - attributes describing the widget
     * @returns {HTMLElement} node
     */

  }, {
    key: 'format',


    /**
     * Set an attribute of the node
     * @param {string} name - attribute name
     * @param {any} value
     * @memberOf WidgetBlot
     */
    value: function format(name, value) {
      if (name === 'id') {
        this.domNode.dataset.id = value;
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
        } else if (value === 'large') {
          this.domNode.classList.add('-large');
          this.domNode.classList.remove('-cover');
        } else {
          this.domNode.classList.remove('-cover');
          this.domNode.classList.remove('-large');
        }
      } else {
        _get(WidgetBlot.prototype.__proto__ || Object.getPrototypeOf(WidgetBlot.prototype), 'format', this).call(this, name, value);
      }
    }

    /**
     * Event handler called when the user clicks the remove button
     * @memberOf WidgetBlot
     */

  }, {
    key: '_onClickRemove',
    value: function _onClickRemove() {
      var offset = this.offset();
      this.editor.deleteText(offset, this.length());
      this.editor.setSelection(offset);
    }

    /**
     * Event handler called when the user clicks the toggle size button
     */

  }, {
    key: '_onClickToggleSize',
    value: function _onClickToggleSize() {
      var formats = WidgetBlot.formats(this.domNode);

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

      this.widget.render();
    }

    /**
     * Render the toolbar
     * @memberOf WidgetBlot
     */

  }, {
    key: '_renderToolbar',
    value: function _renderToolbar() {
      var _this3 = this;

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
        return _this3._onClickRemove();
      });
      this.toolbar.querySelector('.js-toggle-size').addEventListener('click', function () {
        return _this3._onClickToggleSize();
      });
    }
  }], [{
    key: 'create',
    value: function create(obj) {
      var node = _get(WidgetBlot.__proto__ || Object.getPrototypeOf(WidgetBlot), 'create', this).call(this);

      // On the next line we need to check the type of obj because the widget's value (obj)
      // was saved differently in the past and we need to ensure the compatibility with the
      // previous widgets
      var id = (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' ? obj.id : obj;
      var defaultCaption = obj.defaultCaption || false;

      var widgetContainer = document.createElement('div');
      widgetContainer.classList.add('widget-container');
      widgetContainer.classList.add('js-widget-container');

      node.appendChild(widgetContainer);

      // We save the id of the widget into the DOM
      node.dataset.id = id;

      // We don't want the user to be able to edit the widget
      node.setAttribute('contenteditable', false);

      // We add the caption container
      var captionContainer = document.createElement('p');
      captionContainer.classList.add('caption');
      captionContainer.classList.add('js-caption');
      if (defaultCaption) captionContainer.dataset.defaultCaption = 'true';

      node.appendChild(captionContainer);

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
     * Return the attributes describing the widget
     * @static
     * @param {HTMLElement} node
     * @returns {object}
     * @memberOf WidgetBlot
     */

  }, {
    key: 'value',
    value: function value(node) {
      return {
        id: +node.dataset.id
      };
    }

    /**
     * Return the attributes attached to the node
     * @static
     * @param {HTMLElement} node
     * @returns {any}
     * @memberOf WidgetBlot
     */

  }, {
    key: 'formats',
    value: function formats(node) {
      var res = {
        id: +node.dataset.id
      };

      var caption = node.querySelector('.js-caption');
      if (caption && caption.textContent) {
        res.caption = caption.textContent;
      }

      if (node.classList.contains('-cover')) {
        res.size = 'cover';
      } else if (node.classList.contains('-large')) {
        res.size = 'large';
      } else {
        res.size = 'normal';
      }

      return res;
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
