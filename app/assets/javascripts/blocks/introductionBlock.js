((function () {
  'use strict';

  // Definitions of the key codes
  var BACKSPACE_KEY = 8;
  var ENTER_KEY = 13;
  var LEFT_ARROW_KEY = 37;
  var TOP_ARROW_KEY = 38;
  var RIGHT_ARROW_KEY = 39;
  var BOTTOM_ARROW_KEY = 40;

  var ScribePlugin = function (block) {
    return function (scribe) {
      // Mostly borrowed there: https://github.com/madebymany/sir-trevor-js/blob/b28af9e608b736ed495944df94ad54eec55c9d06/src/blocks/scribe-plugins/scribe-text-block-plugin.js
      var isAtStart = false;

      var getTotalLength = function () {
        var selection = new scribe.api.Selection();
        var range = selection.range.cloneRange();
        range.selectNodeContents(scribe.el);

        return range.toString().length;
      };

      // Remove any empty elements at the start of the range.
      var stripFirstEmptyElement = function (div) {
        if (div.firstChild === null) { return; }

        var firstChild = div.firstChild.childNodes[0];
        if (firstChild && firstChild.nodeName !== '#text') {
          if (firstChild.innerText === '') {
            div.firstChild.removeChild(firstChild);
          }
        }
      };

      var rangeToHTML = function (range, extract) {
        var div = document.createElement('div');
        if (extract) {
          div.appendChild(range.extractContents());
        } else {
          div.appendChild(range.cloneContents());
        }

        stripFirstEmptyElement(div);

        // Sometimes you'll get an empty tag at the start of the block.
        if (div.firstChild && div.firstChild.nodeName !== '#text') {
          div = div.lastChild;
        }

        return div.innerHTML.trim();
      };

      var isAtStartOfBlock = function () {
        if (scribe.getTextContent() === '') { return true; }

        var selection = new scribe.api.Selection();
        var range = selection.range.cloneRange();

        range.setStartBefore(scribe.el.firstChild, 0);

        return rangeToHTML(range, false) === '';
      };

      var isAtEndOfBlock = function () {
        var currentRange = {};

        // This bit comes from here: https://github.com/bmcmahen/selection-range/blob/master/index.js
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        var clone = range.cloneRange();
        clone.selectNodeContents(scribe.el);
        clone.setEnd(range.endContainer, range.endOffset);
        currentRange.end = clone.toString().length;
        clone.setStart(range.startContainer, range.startOffset);
        currentRange.start = currentRange.end - clone.toString().length;

        return (getTotalLength() === currentRange.end) && (currentRange.start === currentRange.end);
      };

      scribe.el.addEventListener('keydown', function (e) {
        if (block.supressKeyListeners) {
          return;
        }

        if (e.keyCode === ENTER_KEY && !e.shiftKey) {
          e.preventDefault();

          if (isAtEndOfBlock()) {
            block.mediator.trigger('block:create', 'Text', null, block.el);

            // We remove the extra <br> appended to the end of the element
            var content = scribe.getHTML();
            content = scribe.getHTML().replace(/(<br>)+$/, '');
            scribe.setContent(content);
          }
        } else if ((e.keyCode === LEFT_ARROW_KEY || e.keyCode === TOP_ARROW_KEY) && isAtStartOfBlock()) {
          e.preventDefault();
          block.mediator.trigger('block:focusPrevious', block.blockID);
        } else if (e.keyCode === BACKSPACE_KEY && isAtStartOfBlock()) {
          e.preventDefault();
          isAtStart = true;
        } else if ((e.keyCode === RIGHT_ARROW_KEY || e.keyCode === BOTTOM_ARROW_KEY) && isAtEndOfBlock()) {
          e.preventDefault();
          block.mediator.trigger('block:focusNext', block.blockID);
        }
      });

      scribe.el.addEventListener('keyup', function (e) {
        if (block.supressKeyListeners) {
          return;
        }

        if (e.keyCode === BACKSPACE_KEY && isAtStart) {
          e.preventDefault();

          block.mediator.trigger('block:remove', block.blockID, {
            transposeContent: true
          });

          isAtStart = false;
        }
      });
    };
  };

  SirTrevor.Blocks.Introduction = SirTrevor.Block.extend({

    type: 'introduction',
    icon_name: 'text',
    template: '<p class="st-text-block paragrapg -intro -empty js-content" contenteditable="true"></p>',
    // By making the block textable, we can navigate to the one below by pressing the bottom key
    textable: true,

    scribeOptions: {
      // When the user press the enter key, we don't want to create a new div but insert a
      // <br> tag instead
      allowBlockElements: false
    },

    configureScribe: function (scribe) {
      scribe.use(new ScribePlugin(this));

      scribe.on('content-changed', this.toggleEmptyClass.bind(this));
    },


    editorHTML: function () {
      return this.template;
    },

    getContent: function () {
      return this.inner.querySelector('.js-content');
    },

    loadData: function (data) {
      this.getContent().innerHTML = SirTrevor.toHTML(data.text, this.type);
    },

    _serializeData: function () {
      return {
        format: 'html',
        text: '<p class="paragraph -intro">' + this.getContent().innerHTML + '</p>'
      };
    },

    onBlockRender: function () {
      this.getContent().focus();
    },

    toggleEmptyClass: function () {
      this.getContent().classList.toggle('-empty', this.isEmpty());
    },

    isEmpty: function () {
      return this._scribe.getTextContent() === '';
    }

  });
})(this.App));
