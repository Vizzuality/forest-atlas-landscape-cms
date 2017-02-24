// IMPORTANT
// Quill is built with ES6 classes and is transpiled with Babel. In order to extend a class
// a Quill's class, we have to write the code using ES6 and transpile it down to ES5

// To edit the block, you should modify this file, and transpile it on Babel's website:
// https://babeljs.io/repl/
// Once this is done, copy the output to the file with the same name, but ending with the
// extension ".js", between the two "eslint-disable" and "eslint-enable" comments

var Embed = Quill.import('blots/block/embed');

class HtmlBlot extends Embed {
  /**
   * Creates an instance of HtmlBlot.
   *
   * @param {HTMLElement} domNode
   * @param {String} rawContent
   * @memberOf HtmlBlot
   */
  constructor (domNode, rawContent) {
    super(domNode);

    this.editor = window.editor;
    this.content = domNode.querySelector('.js-raw-html-content');
    this.content.innerHTML = rawContent;

    if (!this.editor.options.readOnly) {
      // We render the toolbar
      this._renderToolbar();
    }
  }

  /**
   * Create the DOM node
   * @returns {HTMLElement} node
   */
  static create () {
    const node = super.create();
    const container = document.createElement('div');

    container.classList.add('js-raw-html-content');
    node.appendChild(container);

    return node;
  }

  /**
   * Event handler called when the user clicks the remove button
   * @memberOf HtmlBlot
   */
  _onClickRemove() {
    const offset = this.offset();
    this.editor.deleteText(offset, this.length());
    this.editor.setSelection(offset);
  }

  /**
   * Render the toolbar
   * @memberOf HtmlBlot
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
  }
}
