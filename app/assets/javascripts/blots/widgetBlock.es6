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

    this.domNode.innerHTML = '<div class="c-loading-spinner"></div>';

    this._fetchWidget()
      .done(function () {
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
          el: domNode,
          data: chart.data,
          chart: config.type,
          columnX: config.x,
          columnY: config.y,
          enableChartSelector: false
        });

        if (!this.editor.options.readOnly) {
          // We render the toolbar
          this._renderToolbar();
        }

        // Little trick to wait for the block to be appended to the DOM
        // before rendering the widget (which requires it)
        setTimeout(() => this.widget.render(), 0);
      }.bind(this))
      .fail(function () {
        if (!this.editor.options.readOnly) {
          App.notifications.broadcast(App.Helper.Notifications.page.widgetError);
          this._onClickRemove();
        } else {
          App.notifications.broadcast(App.Helper.Notifications.widget.loadingWarning);
        }

        this.domNode.innerHTML = '<p class="error">This widget couldn\'t be loaded properly</p>';
      }.bind(this));
  }

  /**
   * Fetch the data associated to the widget
   * @returns {any} jQuery deferred object
   */
  _fetchWidget () {
    var id = WidgetBlot.value(this.domNode);

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
   * Create the DOM node
   * @param {any} value - attributes describing the widget
   * @returns {HTMLElement} node
   */
  static create(value) {
    let node = super.create();

    // We save the id of the widget into the DOM
    node.dataset.id = value;

    // We don't want the user to be able to edit the widget
    node.setAttribute('contenteditable', false);

    return node;
  }

  /**
   * Return the attributes describing the widget
   * @static
   * @param {HTMLElement} node
   * @returns {number}
   * @memberOf WidgetBlot
   */
  static value(node) {
    return +node.dataset.id;
  }

  /**
   * Return the attributes attached to the node
   * @static
   * @param {HTMLElement} node
   * @returns {any}
   * @memberOf WidgetBlot
   */
  static formats(node) {
    return {
      id: +node.dataset.id
    };
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
      hideChangeBtn: true
    });

    // We attach the event listeners
    this.toolbar.querySelector('.js-remove').addEventListener('click', () => this._onClickRemove());
  }
}

WidgetBlot.blotName = 'widget';
WidgetBlot.tagName = 'div';
WidgetBlot.className = '-widget';
