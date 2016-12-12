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

    // We render the widget
    // Sample data
    // TODO: create the logic to retrieve a widget
    this.widget = new App.View.ChartWidgetView({
      el: domNode,
      data: [
        {"x": 1,  "y": 28}, {"x": 2,  "y": 55},
        {"x": 3,  "y": 43}, {"x": 4,  "y": 91},
        {"x": 5,  "y": 81}, {"x": 6,  "y": 53},
        {"x": 7,  "y": 19}, {"x": 8,  "y": 87},
        {"x": 9,  "y": 52}, {"x": 10, "y": 48},
        {"x": 11, "y": 24}, {"x": 12, "y": 49},
        {"x": 13, "y": 87}, {"x": 14, "y": 66},
        {"x": 15, "y": 17}, {"x": 16, "y": 27},
        {"x": 17, "y": 68}, {"x": 18, "y": 16},
        {"x": 19, "y": 49}, {"x": 20, "y": 15}
      ],
      enableChartSelector: false
    });

    // We render the toolbar
    this._renderToolbar();

    // Little trick to wait for the block to be appended to the DOM
    // before rendering the widget (which requires it)
    setTimeout(() => this.widget.render(), 0);
  }

  /**
   * Create the DOM node
   * @param {any} value - attributes describing the widget
   * @returns {HTMLElement} node
   */
  static create(value) {
    let node = super.create();

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
  static value(node) {
    return null;
  }

  /**
   * Return the attributes attached to the node
   * @static
   * @param {HTMLElement} node
   * @returns {any}
   * @memberOf WidgetBlot
   */
  static formats(node) {
    return null;
  }

  /**
   * Set an attribute of the node
   * @param {string} name - attribute name
   * @param {any} value
   * @memberOf WidgetBlot
   */
  format(name, value) {
    super.format(name, value);
  }

  /**
   * Event handler called when the user clicks the remove button
   * @memberOf WidgetBlot
   */
  _onClickRemove() {
    const offset = this.offset();
    window.editor.deleteText(offset, this.length());
    window.editor.setSelection(offset);
  }

  /**
   * Event handler called when the user clicks the change image button
   * @memberOf WidgetBlot
   */
  _onClickChange() {
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
    this.toolbar.innerHTML = HandlebarsTemplates['management/wysiwyg-block-toolbar']();

    // We attach the event listeners
    this.toolbar.querySelector('.js-remove').addEventListener('click', () => this._onClickRemove());
    this.toolbar.querySelector('.js-change').addEventListener('click', () => this._onClickChange());
  }
}

WidgetBlot.blotName = 'widget';
WidgetBlot.tagName = 'div';
WidgetBlot.className = '-widget';
