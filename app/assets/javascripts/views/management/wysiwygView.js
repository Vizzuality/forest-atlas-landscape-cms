((function (App) {
  'use strict';

  App.View.WysiwygView = Backbone.View.extend({

    tagName: 'div',
    className: 'c-wysiwyg',

    sidebarTemplate: HandlebarsTemplates['management/wysiwyg-sidebar'],

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
      'click .js-add-image': '_onClickAddImage',
      'click .js-add-widget': '_onClickAddWidget'
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
     * Event handler called when the sidebar's add image button is clicked
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
          this._hideSidebar();
        }.bind(this));
        reader.readAsDataURL(file);
      }.bind(this));
    },

    /**
     * Event handler called when the sidbar's add widget button is clicked
     */
    _onClickAddWidget: function () {
      // We contract the sidebar
      this._toggleExpandSidebar();

      var range = this.editor.getSelection();
      this.editor.insertEmbed(range.index, 'widget', '', 'user');

      // We hide the sidebar
      this._hideSidebar();
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
      Quill.register(App.Blot.WidgetBlot);
      Quill.register(App.Blot.ImageBlot);

      // We init the editor
      this.editor = new Quill(this.el, {
        theme: 'bubble',
        modules: {
          toolbar: this.options.toolbar
        }
      });

      // We make the editor available globally so blocks can access it
      window.editor = this.editor;

      // We update the placeholder of the link input
      this.editor.theme.tooltip.textbox.dataset.link = 'site.com';

      // We render the sidebar
      this._renderSidebar();

      // We attach the event listeners
      this.setElement(this.el);
      this._setListeners();
    }

  });
})(this.App));
