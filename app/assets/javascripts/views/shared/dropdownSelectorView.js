((function (App) {
  'use strict';

  App.View.DropdownSelectorView = Backbone.View.extend({

    template: HandlebarsTemplates['shared/dropdown-selector'],

    events: {
      'click .js-list-btn': '_onClickListBtn',
      'keydown .js-list-btn': '_onKeydownListBtn',
      'click .js-option': '_onClickOption',
      'keydown .js-option': '_onKeydownOption'
    },

    defaults: {
      // List of options for the selector
      // Each options should have this format:
      // { id: string, name: string, shortName: string, separator: bool }
      // The shortName and separator options are optional
      options: [],
      // Active option (from the list above)
      // NOTE: This is mandatory
      activeOption: null,
      // If true, the active option will always be the same
      // When the user choose another one, only the callback will be executed
      // The active option won't appear in the list of options
      fixedOption: false,
      // Use the short name for the active option when the selector is closed
      useShortName: false,
      // Position of the arrow relatively to the active option's name
      // Choose between "right" and "left"
      // Set to "null" if you don't want the arrow to appear
      arrowPosition: 'right',
      // Towards which direction the selector should be aligned
      align: 'left',
      // Whether the width of the component is fixed or automatic
      fixedWidth: false,
      // Callback executed when the active option is changed
      // It's passed the id of the new active option
      onChangeCallback: function () {}
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      this.render();

      this._setListeners();
    },

    /**
     * Set the listeners not attached to any DOM element of this.el
     */
    _setListeners: function () {
      document.body.addEventListener('click', function (e) {
        if ($(e.target).closest(this.el).length) return;
        this._hideDropdown();
      }.bind(this));
    },

    /**
     * Event handler executed when the active option is clicked
     * @param {Event} e - event
     */
    _onClickListBtn: function (e) {
      e.stopPropagation();
      this._toggleDropdown();
    },

    /**
     * Event handler executed when the user presses a key while
     * the focus is on the active option
     * @param {Event} e - event
     */
    _onKeydownListBtn: function (e) {
      if (e.keyCode !== 13 && e.keyCode !== 32) return;
      e.preventDefault();
      this._toggleDropdown();
    },

    /**
     * Event handler executed when an option is clicked
     * @param {Event} e - event
     */
    _onClickOption: function (e) {
      this._setActiveOption(e.target);
    },

    /**
     * Event handler executed when the user presses a key while the
     * focus is on one of the options
     * @param {Event} e - event
     */
    _onKeydownOption: function (e) {
      switch (e.keyCode) {
        case 37: // Left arrow
        case 38: // Up arrow
          this._moveOptionfocusOption('previous');
          e.preventDefault();
          e.stopPropagation();
          break;

        case 39: // Right arrow
        case 40: // Down arrow
          this._moveOptionfocusOption('next');
          e.preventDefault();
          e.stopPropagation();
          break;

        case 13: // Enter
        case 32: // Space
          this._setActiveOption(e.target);
          e.preventDefault();
          e.stopPropagation();
          break;

        default:
          break;
      }
    },

    /**
     * Set the specied option as active i.e. set an "active" class to it, update
     * this.options, execute the "change" callback and close the dropdown
     * @param {HTMLElement} option
     */
    _setActiveOption: function (option) {
      var id = option.dataset.id;

      if (!this.options.fixedOption) {
        var activeOption = this.el.querySelector('.js-option.-active');

        activeOption.classList.remove('-active');
        activeOption.setAttribute('tabindex', -1);
        option.classList.add('-active');

        this.options.activeOption = _.findWhere(this.options.options, { id: id });

        // We update the UI with the name of the new active option
        var activeOptionName = this.options.activeOption[this.options.useShortName ? 'shortName' : 'name'];
        this.el.querySelector('.js-list-btn').textContent = activeOptionName;
      }

      this.options.onChangeCallback(id);
      this._hideDropdown();
    },

    /**
     * Move the focus on the previous or next option on the list
     * depending on the direction
     * If the first or last option is reached, go to the last or the
     * first one
     * @param {'previous'|'next'} direction
     */
    _moveOptionfocusOption: function (direction) {
      var focusedOption = this.el.querySelector('.js-option:focus');
      var previousOption = focusedOption.previousElementSibling;
      var nextOption = focusedOption.nextElementSibling;

      if ((direction === 'previous' && !previousOption) ||
        (direction === 'next' && !nextOption)) {
        var options = focusedOption.parentElement.querySelectorAll('.js-option');
        var firstOption = options[0];
        var lastOption = options[options.length - 1];

        this._setOptionFocus(direction === 'previous' ? lastOption : firstOption);
      } else {
        this._setOptionFocus(direction === 'previous' ? previousOption : nextOption);
      }

      focusedOption.setAttribute('tabindex', -1);
    },

    /**
     * Set the focus on a specific option
     * @param {HTMLElement} option
     */
    _setOptionFocus: function (option) {
      option.setAttribute('tabindex', 0);
      option.focus();
    },

    /**
     * Remove the focus of all the options
     */
    _removeOptionsFocus: function () {
      if (!this.el) return;
      var options = this.el.querySelectorAll('.js-option');
      Array.prototype.slice.call(options).forEach(function (option) {
        option.setAttribute('tabindex', -1);
      });
    },

    /**
     * Toggle the dropdown's visibility
     */
    _toggleDropdown: function () {
      var isOpened = this.dropdown.classList.toggle('-visible');

      var activeOption;
      if (this.options.fixedOption) {
        activeOption = this.el.querySelector('.js-option');
      } else {
        activeOption = this.el.querySelector('.js-option.-active');
      }

      if (isOpened) {
        this._setOptionFocus(activeOption);
      } else {
        this._removeOptionsFocus();
      }
    },

    /**
     * Hide the dropdown
     */
    _hideDropdown: function () {
      if (!this.dropdown) return;
      this._removeOptionsFocus();
      this.dropdown.classList.remove('-visible');
    },
    /**
     * Sets the Active Option object insides the this.options, not to confuse with the DOM options
     */
    setActive: function (active) {
      this.options.activeOption = active;
    },

    render: function () {
      if (this.el) {
        this.el.innerHTML = this.template({
          options: this.options.options,
          activeOption: this.options.activeOption,
          fixedOption: this.options.fixedOption,
          useShortName: this.options.useShortName,
          align: this.options.align,
          arrowPosition: this.options.arrowPosition,
          fixedWidth: this.options.fixedWidth
        });
        this.dropdown = this.el.querySelector('.js-dropdown');
      }
    }

  });
})(this.App));
