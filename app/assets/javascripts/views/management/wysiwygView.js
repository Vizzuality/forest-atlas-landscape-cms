((function (App) {
  'use strict';

  App.View.WysiwygView = Backbone.View.extend({

    tagName: 'div',
    className: 'c-wysiwyg',

    sidebarTemplate: HandlebarsTemplates['management/wysiwyg-sidebar'],
    imageToolbarTemplate: HandlebarsTemplates['management/wysiwyg-image-toolbar'],

    defaults: {
      // Options for the tooltip
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', { header: 1 }, { header: 2 }, 'blockquote', 'link']
        ]
      }
    },

    events: {
      'click .js-toggle-expand-sidebar': '_onClickToggleExpandSidebar',
      'click .js-add-image': '_onClickAddImage'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      this.render();
    },

    /**
     * Event handler called when the sidebar's button to expand is clicked
     */
    _onClickToggleExpandSidebar: function () {
      this._toggleExpandSidebar();
    },

    /**
     * Event handler for when the editor sends a change event
     * @param {string} eventType - type of event
     * @param {number} range - length of the cursor selection
     */
    _onEditorChange: function (eventType, range) {
      if (eventType !== Quill.events.SELECTION_CHANGE || range === null) return;

      var lineBounds = this.editor.getBounds(range);
      this.sidebar.style.top = (lineBounds.top + 10) + 'px';

      // If the length of the selection is 0 (i.e. the user just clicked somwhere)
      if (range.length === 0) {
        var info = this.editor.scroll.descendant(Quill.import('blots/block'), range.index);
        var block = info[0];

        // NOTE: An empty line contains a <br> element
        if (block !== null && block.domNode.firstChild instanceof HTMLBRElement) {
          this._showSidebar();
        } else {
          this._hideSidebar();
        }
      } else {
        this._hideSidebar();
      }
    },

    /**
     * Event handler called when the sidebar's add button is clicked
     */
    _onClickAddImage: function () {
      // We contract the sidebar
      this._toggleExpandSidebar();

      // We open a file explorer
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.click();

      input.addEventListener('change', function () {
        var file = input.files[0];
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          this._addImage(reader.result);
        }.bind(this));
        reader.readAsDataURL(file);
      }.bind(this));
    },

    /**
     * Event handler called when the mouse is over an image
     * @param {object} e - event object
     */
    _onMouseoverImage: function (e) {
      var image = e.target;
      this.activeImage = image;
      var top = image.offsetTop;
      this.imageToolbar.style.top = top + 'px';
      this._showImageToolbar();
    },

    /**
     * Event handler called when the mouse leaves an image
     * @param {object} e - event object
     */
    _onMouseoutImage: function (e) {
      if ($(e.relatedTarget).closest(this.imageToolbar).length) return;
      this._hideImageToolbar();
      this.activeImage = null;
    },

    /**
     * Event handler called when the mouse leaves the image toolbar
     */
    _onMouseoutImageToolbar: function (e) {
      if (e.relatedTarget !== this.activeImage) {
        this._hideImageToolbar();
        this.activeImage = null;
      }
    },

    /**
     * Set the event listeners of the wysiwyg
     */
    _setListeners: function () {
      this.editor.on(Quill.events.EDITOR_CHANGE, this._onEditorChange.bind(this));
    },

    saveHTML: function () {
    },

    /**
     * Add an image to the text editor
     * @param {string} base64 - base64-encoded image
     */
    _addImage: function (base64) {
      this.editor.focus(); // The editor could loose the focuse
      var range = this.editor.getSelection();
      this.editor.insertEmbed(range.index, 'image', base64, 'user');

      // We add the listeners on the image
      var image = this.editor.selection.getNativeRange().start.node;
      image.addEventListener('mouseover', this._onMouseoverImage.bind(this));
      image.addEventListener('mouseout', this._onMouseoutImage.bind(this));
    },

    /**
     * Hide the sidebar
     */
    _showSidebar: function () {
      this.sidebar.classList.remove('-hidden');
    },

    /**
     * Hide the sidebar
     * NOTE: it also contracts the sidebar
     */
    _hideSidebar: function () {
      this.sidebar.classList.add('-hidden');
      this.sidebar.classList.remove('-expanded');
    },

    /**
     * Expand the sidebar
     * NOTE: if the sidebar was hidden, it will make it visible
     */
    _expandSidebar: function () {
      this._showSidebar();
      this.sidebar.classList.add('-expanded');
    },

    /**
     * Expand or contract the sidebar depending of its current state
     */
    _toggleExpandSidebar: function () {
      this.sidebar.classList.toggle('-expanded');
    },

    /**
     * Hide the image toolbar
     */
    _hideImageToolbar: function () {
      this.imageToolbar.classList.add('-hidden');
    },

    /**
     * Show the image toolbar
     */
    _showImageToolbar: function () {
      this.imageToolbar.classList.remove('-hidden');
    },

    /**
     * Render the sidebar
     */
    _renderSidebar: function () {
      if (this.sidebar) return;

      // We create the element with the default state
      this.sidebar = document.createElement('div');
      this.el.parentNode.insertBefore(this.sidebar, this.el);
      this.sidebar.classList.add('sidebar');
      this._hideSidebar();

      // We append its content
      this.sidebar.innerHTML = this.sidebarTemplate();

      // We tell the editor about the sidebar
      this.editor.addContainer(this.sidebar);
    },

    /**
     * Render the image toolbar
     */
    _renderImageToolbar: function () {
      // We create the element with the default state
      this.imageToolbar = document.createElement('div');
      this.el.parentNode.insertBefore(this.imageToolbar, this.el);
      this.imageToolbar.classList.add('image-toolbar');
      this._hideImageToolbar();

      // We append its content
      this.imageToolbar.innerHTML = this.imageToolbarTemplate();

      // We tell the editor about the element
      this.editor.addContainer(this.imageToolbar);

      // We attache the event listeners
      this.imageToolbar.addEventListener('mouseout', this._onMouseoutImageToolbar.bind(this));
    },

    render: function () {
      // We update the wysiwyg's tooltip so it's displayed on above of the text
      var tooltip = Quill.import('ui/tooltip');
      tooltip.prototype.checkBounds = function () {};
      tooltip.prototype.position = function (reference) {
        var left = (reference.left + (reference.width / 2)) - (this.root.offsetWidth / 2);
        var top = reference.top - this.root.offsetHeight - 20;
        this.root.style.left = left + 'px';
        this.root.style.top = top + 'px';
      };

      // We register the custom blots
      Quill.register(App.Blot.IntroductionBlot);

      // We init the editor
      this.editor = new Quill(this.el, {
        theme: 'bubble',
        modules: {
          toolbar: this.options.toolbar
        }
      });

      // We update the placeholder of the link input
      this.editor.theme.tooltip.textbox.dataset.link = 'site.com';

      // We render the sidebar
      this._renderSidebar();

      // We render the image edition toolbar
      this._renderImageToolbar();

      // We attach the event listeners
      this.setElement(this.el);
      this._setListeners();
    }

  });
})(this.App));
