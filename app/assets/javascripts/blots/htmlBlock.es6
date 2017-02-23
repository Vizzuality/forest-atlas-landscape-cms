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
   * @param {{ src: string }} value
   *
   * @memberOf ImageBlot
   */
  constructor (domNode, value) {
    super(domNode, value);

    this.image = domNode.querySelector('.js-image');
    this.caption = domNode.querySelector('.js-caption');
    this.editor = window.editor;

    if (!this.editor.options.readOnly) {
      // We render the toolbar
      this._renderToolbar();

      // We make the caption editable
      this.caption.setAttribute('contenteditable', true);

      // We attach the listeners
      this.image.addEventListener('mouseover', () => this._onMouseoverImage());
      this.image.addEventListener('mouseout', e => this._onMouseoutImage(e));
    }
  }

  /**
   * Create the DOM node
   * @param {any} value - URL of the image (or base64)
   * @returns {HTMLElement} node
   */
  static create (value) {
    const node = super.create();

    const container = document.createElement('div');
    node.appendChild(container);

    const image = document.createElement('img');
    image.classList.add('js-image');
    if (typeof value === 'string') image.setAttribute('src', value);

    container.appendChild(image);

    // We don't want the user to be able to add text within the container
    node.setAttribute('contenteditable', false);

    // We add the caption container
    const captionContainer = document.createElement('p');
    captionContainer.classList.add('caption', 'js-caption');

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
}
