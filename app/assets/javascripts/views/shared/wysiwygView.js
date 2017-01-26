((function (App) {
  'use strict';

  App.View.WysiwygView = Backbone.View.extend({

    tagName: 'div',
    className: 'c-wysiwyg',

    sidebarTemplate: HandlebarsTemplates['management/wysiwyg-sidebar'],

    defaults: {
      // Default serialized content of the wysiwyg
      serializedContent: null,
      // Set the wysiwyg as read only (i.e. a viewer)
      readOnly: false,
      // Options for the tooltip
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', { header: 1 }, { header: 2 }, 'intro', 'blockquote', 'link']
        ]
      },
      // List of widgets for the sidebar's widget option
      widgets: [],
      // Maximum size of the uploaded images
      maxImageSize: {
        width: 1060,
        height: 600
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

      this._getBase64Image()
        .done(function (base64) {
          this._addImage(base64);
        }.bind(this))
        .fail(function () {
          App.notifications.broadcast(App.Helper.Notifications.page.imageUploadError);
        })
        .always(function () {
          this._hideSidebar();
        }.bind(this));
    },

    /**
     * Event handler called when the sidbar's add widget button is clicked
     */
    _onClickAddWidget: function () {
      // We contract the sidebar
      this._toggleExpandSidebar();

      // We save the position of the cursor within the wysiwyg
      var range = this.editor.getSelection();

      var modal = new App.View.ModalView();

      // If exists, we delete the previous modal
      if (this.widgetsModalView) this.widgetsModalView.remove();

      this.widgetsModalView = new App.View.WidgetsModalView({
        cancelCallback: function () { modal.close(); },
        continueCallback: function (widgetId) {
          modal.close();
          this.editor.insertEmbed(range.index, 'widget', widgetId, 'user');
        }.bind(this),
        widgets: this.options.widgets
      });

      modal.render = this.widgetsModalView.render;


      modal.open();

      // We hide the sidebar
      this._hideSidebar();
    },

    /**
     * Set the event listeners of the wysiwyg
     */
    _setListeners: function () {
      this.editor.on(Quill.events.EDITOR_CHANGE, this._onEditorChange.bind(this));
    },

    /**
     * Return a deferred of an optimized version of the image passed as a
     * base64 string. The image is rescaled to fit within the viewport box
     * described by this.options.maxImageSize
     * @param {string} base64
     * @returns {object} deferred - $.Deferred
     */
    _getOptimizedBase64: function (base64) {
      // We create the deferred object
      var deferred = $.Deferred(); // eslint-disable-line new-cap

      // We create the image
      var image = document.createElement('img');

      image.addEventListener('load', function () {
        // We compute the necessary scales on both the axis
        var scales = {
          x: this.options.maxImageSize.width / image.width,
          y: this.options.maxImageSize.height / image.height
        };

        // Final scale
        var scale = scales.x < scales.y ? scales.x : scales.y;

        // We the image doesn't need to be rescaled, we return
        if (scale > 1) {
          return deferred.resolve(base64);
        }

        // We create the canvas
        var canvas = document.createElement('canvas');
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;

        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width * scale, image.height * scale);

        return deferred.resolve(canvas.toDataURL());
      }.bind(this));

      image.addEventListener('error', deferred.reject);

      // We give the image its content
      image.src = base64;

      return deferred;
    },

    /**
     * Ask the user for an image and return its optimized base64 representation
     * through a jQuery Deferred object
     * @returns {object} $.Deferred
     */
    _getBase64Image: function () {
      var deferred = $.Deferred(); // eslint-disable-line new-cap

      // We open a file explorer
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.click();

      input.addEventListener('change', function () {
        var file = input.files[0];
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          this._getOptimizedBase64(reader.result)
            .done(function (base64) {
              deferred.resolve(base64);
            })
            .fail(deferred.reject);
        }.bind(this));

        reader.addEventListener('error', deferred.reject);

        reader.readAsDataURL(file);
      }.bind(this));

      return deferred;
    },

    /**
     * Return the serialized content (delta) of the wysiwyg
     * @returns {string} serializedContent
     */
    getSerializedContent: function () {
      return this.editor.getContents();
    },

    /**
     * Restore the content of the wysiwyg
     */
    _restoreContent: function () {
      this.editor.setContents(this.options.serializedContent);
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
      // We register the custom blots
      Quill.register(App.Blot.IntroductionBlot);
      Quill.register(App.Blot.WidgetBlot);
      Quill.register(App.Blot.ImageBlot);

      // We set the custom icons for the toolbar's buttons
      var icons = Quill.import('ui/icons');
      /* eslint-disable max-len */
      icons.bold = '<svg width="15" height="14" viewBox="0 0 15 14" xmlns="http://www.w3.org/2000/svg"><path d="M12.91 7.643c.417.286.755.646 1.016 1.079.26.433.39.942.39 1.528 0 .703-.148 1.297-.444 1.782-.296.485-.721.868-1.274 1.148-.586.3-1.262.51-2.027.634-.765.124-1.665.186-2.7.186H.674v-.762c.202-.02.456-.049.762-.088.306-.039.52-.084.644-.136.241-.098.405-.227.493-.386.088-.16.132-.366.132-.62V2.242c0-.234-.036-.43-.107-.586-.072-.156-.244-.293-.518-.41a3.84 3.84 0 0 0-.703-.21C1.11.981.876.936.674.904V.143h7.53c1.894 0 3.26.26 4.1.78.84.522 1.26 1.29 1.26 2.306 0 .468-.094.88-.283 1.235a2.758 2.758 0 0 1-.81.923c-.32.24-.7.449-1.143.625a9.88 9.88 0 0 1-1.426.44v.185a7.966 7.966 0 0 1 1.582.337 5.452 5.452 0 0 1 1.426.669zm-3.144-4.17c0-.769-.217-1.368-.65-1.797-.433-.43-1.082-.645-1.948-.645-.124 0-.285.005-.483.015l-.513.024v5.137h.508c1.054 0 1.832-.246 2.334-.737.501-.492.752-1.157.752-1.997zm.683 6.65c0-.963-.286-1.702-.86-2.217-.572-.514-1.396-.771-2.47-.771-.124 0-.288.005-.493.014-.205.01-.356.018-.454.025v5.068c.058.241.24.445.547.61.306.167.677.25 1.113.25.775 0 1.405-.26 1.89-.782.485-.52.727-1.253.727-2.197z" fill="#FFF" fill-rule="evenodd"/></svg>';
      icons.italic = '<svg width="7" height="16" viewBox="0 0 7 16" xmlns="http://www.w3.org/2000/svg"><path d="M5.38 13.936l-.146.625a12.93 12.93 0 0 1-1.435.502 3.696 3.696 0 0 1-.918.142c-.521 0-.912-.135-1.172-.405-.26-.27-.39-.604-.39-1.001 0-.15.012-.306.038-.469.026-.163.069-.368.127-.615l1.036-4.15c.052-.228.102-.473.15-.733.05-.26.074-.482.074-.664 0-.365-.06-.607-.18-.728-.121-.12-.367-.18-.738-.18-.143 0-.333.023-.571.068a8.817 8.817 0 0 0-.542.117l.146-.625a9.6 9.6 0 0 1 1.368-.508c.403-.11.722-.166.957-.166.533 0 .92.127 1.162.381.24.254.361.596.361 1.026a4.963 4.963 0 0 1-.156 1.084l-1.045 4.15c-.065.254-.122.503-.171.747a3.19 3.19 0 0 0-.073.6c0 .372.083.626.249.762.166.137.434.206.805.206.124 0 .302-.017.533-.05.23-.032.408-.07.532-.116zm.694-12.48c0 .37-.12.694-.361.97-.241.277-.54.416-.899.416-.332 0-.618-.132-.859-.396a1.302 1.302 0 0 1-.361-.903c0-.358.12-.67.361-.938.241-.266.527-.4.86-.4.37 0 .673.125.908.376.234.25.351.542.351.874z" fill="#FFF" fill-rule="evenodd"/></svg>';
      icons.underline = '<svg width="10" height="14" viewBox="0 0 10 14" xmlns="http://www.w3.org/2000/svg"><path d="M.86.46v7.66c0 1.96.88 3.12 2.9 3.12 1.22 0 2.38-.58 3.2-1.64L7.1 11h1.58V.46H6.84v7.72c-.56.88-1.5 1.62-2.58 1.62-1.14 0-1.56-.54-1.56-1.9V.46H.86zM0 13h10v1H0v-1z" fill="#FFF" fill-rule="evenodd"/></svg>';
      icons.header['1'] = '<svg width="16" height="12" viewBox="0 0 16 12" xmlns="http://www.w3.org/2000/svg"><path d="M8.408 12V.944H6.28v4.432H2.472V.944H.344V12h2.128V7.056H6.28V12h2.128zm6.8 0V1.232H13.4l-3.456 2.16.912 1.376 2.336-1.424V12h2.016z" fill="#FFF" fill-rule="evenodd"/></svg>';
      icons.header['2'] = '<svg width="18" height="12" viewBox="0 0 18 12" xmlns="http://www.w3.org/2000/svg"><path d="M8.408 12V.944H6.28v4.432H2.472V.944H.344V12h2.128V7.056H6.28V12h2.128zM17 4.128c0-1.744-1.28-3.088-3.488-3.088-1.488 0-2.64.64-3.504 1.76l1.264.992c.656-.784 1.232-1.136 2.064-1.136.928 0 1.552.576 1.552 1.616 0 1.472-.88 2.576-4.576 6.224V12h6.704l.224-1.616h-4.608C15.976 7.328 17 5.888 17 4.128z" fill="#FFF" fill-rule="evenodd"/></svg>';
      icons.blockquote = '<svg width="11" height="10" viewBox="0 0 11 10" xmlns="http://www.w3.org/2000/svg"><path d="M4.568 6.963c0-.754-.319-1.334-.841-1.682L4.771.757H2.77L.885 4.701C.363 5.774.218 6.354.218 6.963c0 1.189.928 2.088 2.175 2.088 1.218 0 2.175-.899 2.175-2.088zm5.684 0c0-.754-.348-1.334-.87-1.682L10.455.757h-2.03L6.54 4.701c-.493 1.073-.638 1.653-.638 2.262 0 1.189.928 2.088 2.146 2.088s2.204-.899 2.204-2.088z" fill="#FFF" fill-rule="evenodd"/></svg>';
      icons.link = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.089c.81-.81 1.79-1.21 2.942-1.201 1.15.009 2.131.418 2.941 1.229.81.81 1.22 1.79 1.23 2.941C15.121 6.21 14.72 7.19 13.91 8l-2.375 2.375-1.133-1.132 2.375-2.375a2.48 2.48 0 0 0 .746-1.823 2.48 2.48 0 0 0-.746-1.823 2.48 2.48 0 0 0-1.823-.746 2.48 2.48 0 0 0-1.823.746L6.757 5.597 5.625 4.464 8 2.09zm-1.768 8.839l-1.16-1.16 4.696-4.696 1.16 1.16-4.696 4.696zm-3.01 1.85a2.48 2.48 0 0 0 1.823.746 2.48 2.48 0 0 0 1.823-.746l2.375-2.375 1.132 1.133L8 13.91c-.81.81-1.79 1.21-2.942 1.201-1.15-.009-2.131-.418-2.941-1.229-.81-.81-1.22-1.79-1.23-2.941C.879 9.79 1.28 8.81 2.09 8l2.375-2.375 1.133 1.132-2.375 2.375a2.48 2.48 0 0 0-.746 1.823c0 .719.248 1.326.746 1.823z" fill="#FFF" fill-rule="evenodd"/></svg';
      icons.intro = '<svg width="18" height="12" viewBox="0 0 18 12" xmlns="http://www.w3.org/2000/svg"><path d="M8.095 12H6.424l-.528-1.92H3.124L2.596 12H.94l2.628-8.292h1.956l2.571 8.188L11.566.944h2.608L17.646 12h-2.272l-.704-2.56h-3.696L10.27 12H8.095zM4.492 5.028h.048L5.596 8.88H3.424l1.068-3.852zm8.306-2.324h.064L14.27 7.84h-2.896l1.424-5.136z" fill="#FFF" fill-rule="evenodd"/></svg>';
      /* eslint-enable max-len */

      // We init the editor
      this.editor = new Quill(this.el, {
        readOnly: this.options.readOnly,
        theme: 'bubble',
        modules: {
          toolbar: this.options.toolbar
        }
      });

      // We make the editor available globally so blocks can access it
      window.editor = this.editor;

      if (!this.options.readOnly) {
        // We update the wysiwyg's tooltip so it's displayed on above of the text
        var tooltip = Quill.import('ui/tooltip');
        tooltip.prototype.checkBounds = function () {};
        tooltip.prototype.position = function (reference) {
          var left = (reference.left + (reference.width / 2)) - (this.root.offsetWidth / 2);
          var top = reference.top - this.root.offsetHeight - 20;
          this.root.style.left = left + 'px';
          this.root.style.top = top + 'px';
        };

        // We update the placeholder of the link input
        this.editor.theme.tooltip.textbox.dataset.link = 'site.com';

        // We render the sidebar
        this._renderSidebar();

        // We attach the event listeners
        this.setElement(this.el);
        this._setListeners();
      }

      if (this.options.serializedContent) {
        this._restoreContent();
      }
    }

  });
})(this.App));
