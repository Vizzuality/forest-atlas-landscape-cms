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
   *
   * @memberOf HtmlBlot
   */
  constructor (domNode) {
    super(domNode);

    this.htmlContainer = domNode.querySelector('.js-html-container');
    this.editor = window.editor;

    if (!this.editor.options.readOnly) {
      // We render the toolbar
      this._renderToolbar();

      // We make the htmlContainer editable
      this.htmlContainer.setAttribute('contenteditable', true);

    }
  }

  /**
   * Create the DOM node
   * @returns {HTMLElement} node
   */
  static create () {
    const node = super.create();

    const container = document.createElement('textarea');
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
