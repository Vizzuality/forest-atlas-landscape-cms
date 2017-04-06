// IMPORTANT
// Quill is built with ES6 classes and is transpiled with Babel. In order to extend a class
// a Quill's class, we have to write the code using ES6 and transpile it down to ES5

// To edit the block, you should modify this file, and transpile it on Babel's website:
// https://babeljs.io/repl/
// Once this is done, copy the output to the file with the same name, but ending with the
// extension ".js", between the two "eslint-disable" and "eslint-enable" comments

var Embed = Quill.import('blots/block/embed');

class WidgetBlot extends Embed {
  /**
   * Creates an instance of WidgetBlot.
   *
   * @param {HTMLElement} domNode
   * @param {any} value
   *
   * @memberOf WidgetBlot
   */
  constructor(domNode, value) {
    super(domNode, value);

    this.editor = window.editor;
    this.caption = domNode.querySelector('.js-caption');
    this.widgetContainer = this.domNode.querySelector('.js-widget-container');

    if (!this.editor.options.readOnly) {
      // We make the caption editable
      this.caption.setAttribute('contenteditable', true);
    }

    this.widgetContainer.innerHTML = '<div class="c-loading-spinner"></div>';

    this._fetchWidget()
      .done(() => {
        this._initWidget();

        // If wanted, we set the widget's description as default text
        // of the caption
        if (this.caption.dataset.defaultCaption) {
          this.caption.textContent = this.model.toJSON().description;
        }
      })
      .fail(function () {
        if (!this.editor.options.readOnly) {
          App.notifications.broadcast(App.Helper.Notifications.page.widgetError);
          this._onClickRemove();
        } else {
          App.notifications.broadcast(App.Helper.Notifications.widget.loadingWarning);
        }

        this.widgetContainer.innerHTML = '<p class="error">This widget couldn\'t be loaded properly</p>';
      }.bind(this));
  }

  /**
   * Fetch the data associated to the widget
   * @returns {any} jQuery deferred object
   */
  _fetchWidget () {
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
  _initWidget () {
    var chart = this.model.toJSON();

    // We retrieve the chart's configuration
    var config;
    try {
      config = JSON.parse(chart.visualization);
    } catch (e) {
      config = {
        type: null,
        x: null,
        y: null
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
    setTimeout(() => this.widget.render(), 0);
  }

  /**
   * Create the DOM node
   * @param {any} obj - attributes describing the widget
   * @returns {HTMLElement} node
   */
  static create(obj) {
    let node = super.create();

    // On the next line we need to check the type of obj because the widget's value (obj)
    // was saved differently in the past and we need to ensure the compatibility with the
    // previous widgets
    const id = typeof obj === 'object' ? obj.id : obj;
    const defaultCaption = obj.defaultCaption || false;

    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('widget-container', 'js-widget-container');
    node.appendChild(widgetContainer);

    // We save the id of the widget into the DOM
    node.dataset.id = id;

    // We don't want the user to be able to edit the widget
    node.setAttribute('contenteditable', false);

    // We add the caption container
    const captionContainer = document.createElement('p');
    captionContainer.classList.add('caption', 'js-caption');
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
  static value(node) {
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
  static formats(node) {
    const res = {
      id: +node.dataset.id
    };

    const caption = node.querySelector('.js-caption');
    if (caption && caption.textContent) {
      res.caption = caption.textContent;
    }

    if (node.classList.contains('-cover')) {
      res.size = 'cover';
    } else if (node.classList.contains('-large')) {
      res.size = 'large'
    } else {
      res.size = 'normal';
    }

    return res;
  }

  /**
   * Set an attribute of the node
   * @param {string} name - attribute name
   * @param {any} value
   * @memberOf WidgetBlot
   */
  format(name, value) {
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
      super.format(name, value);
    }
  }

  /**
   * Event handler called when the user clicks the remove button
   * @memberOf WidgetBlot
   */
  _onClickRemove() {
    const offset = this.offset();
    this.editor.deleteText(offset, this.length());
    this.editor.setSelection(offset);
  }

  /**
   * Event handler called when the user clicks the toggle size button
   */
  _onClickToggleSize() {
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
  _renderToolbar() {
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
    this.toolbar.querySelector('.js-remove').addEventListener('click', () => this._onClickRemove());
    this.toolbar.querySelector('.js-toggle-size').addEventListener('click', () => this._onClickToggleSize());
  }
}

WidgetBlot.blotName = 'widget';
WidgetBlot.tagName = 'div';
WidgetBlot.className = '-widget';
