((function (App) {
  'use strict';

  App.View.HierarchicalSelectView = Backbone.View.extend({

    className: 'c-hierarchical-select',
    template: Handlebars.compile('\
      <div class="label js-label" id="hierarchical-select-{{selectID}}">\
        {{label}}\
        <div class="arrow"></div>\
      </div>\
      <div class="steps-wrapper -hidden js-steps-wrapper">\
        <div class="steps js-steps"></div>\
      </div>'),
    stepTemplate: Handlebars.compile('\
      <div class="step">\
        <ul class="options" role="list-box" aria-labelledby="hierarchical-select-{{selectID}}">\
          {{#each options}}\
            <li class="option {{#if options}}-arrow{{/if}} js-option" role="option" tabindex="0" aria-selected="false" data-id="{{id}}">\
              {{name}}\
              <div class="arrow"></div>\
            </li>\
          {{/each}}\
        </ul>\
      </div>'),

    events: {
      'click .js-label': '_onClickLabel',
      'click .js-option': '_onClickOption',
      'keydown': '_onKeydown',
      'keydown .js-option': '_onKeydownOption'
    },

    defaults: {
      // Hierarchy of the selector
      // It's made of options contained within a rescursive list of steps
      // Example:
      // {
      //   label: 'Chart type',
      //   options: [
      //     { name: 'Option 1', id: 'option-1' },
      //     {
      //       name: 'Option 2',
      //       id: 'option-2',
      //       step: {
      //         label: 'Column',
      //         options: [
      //           {},
      //           {}
      //         ]
      //     }
      //   ]
      // }
      hierarchy: null,
      // Unique ID (needed for accessibility)
      ID: null,
      // Callback for when the user selected all the options
      onChange: function () {},
      // Path within the hierarchy using the ids
      _path: []
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      // We need to copy it manually because Object.assign doesn't deep clone
      // eslint-disable-next-line no-underscore-dangle
      this.options._path = Array.prototype.slice.call(this.options._path);

      if (!this.options.ID) {
        // eslint-disable-next-line no-console
        console.warn('The hierarchical selector needs a unique ID');
        return;
      }

      this.render();
      this._setListeners();
    },

    /**
     * Attach the event listeners that aren't binded to the component's DOM
     */
    _setListeners: function () {
      document.body.addEventListener('click', this._onClickBody.bind(this));
    },

    /**
     * Listener for the key events on the container
     * @param {object} e - event
     */
    _onKeydown: function (e) {
      switch (e.keyCode) {
        case 8: // backspace key
          // eslint-disable-next-line no-underscore-dangle
          if (this.options._path.length) this._navigateBackward();
          break;

        case 13: // enter key
        case 32: // space key
          this._toggle();
          break;

        case 27: // esc key
          e.preventDefault();
          this._toggle(false);
          break;

        case 37: // left arrow
        case 38: // top arrow
          e.preventDefault();
          this._focusPreviousOption();
          break;

        case 39: // right arrow
        case 40: // down arrow
          e.preventDefault();
          this._focusNextOption();
          break;

        default:
      }
    },

    /**
     * Listener for the key events on the options
     * @param {object} e - event
     */
    _onKeydownOption: function (e) {
      switch (e.keyCode) {
        case 13: // enter key
        case 32: // space key
          e.preventDefault();
          e.stopPropagation();
          this._navigateForward(e.target.dataset.id);
          break;

        case 37: // left arrow
        case 38: // top arrow
          e.preventDefault();
          e.stopPropagation();
          this._focusPreviousOption();
          break;

        case 39: // right arrow
        case 40: // down arrow
          e.preventDefault();
          e.stopPropagation();
          this._focusNextOption();
          break;

        default:
      }
    },

    /**
     * Event handler for when the user clicks anywhere but the selector
     */
    _onClickBody: function () {
      this.reset();
    },

    /**
     * Event handler for the click on the label
     * @param {object} e - event
     */
    _onClickLabel: function (e) {
      e.stopPropagation(); // Need it so we don't call _onClickBody
      // eslint-disable-next-line no-underscore-dangle
      if (this.options._path.length) this._navigateBackward();
      else this._toggle();
    },

    /**
     * Event handler for the click on an option
     * @params {object} e - event
     */
    _onClickOption: function (e) {
      e.stopPropagation(); // Need it so we don't call _onClickBody
      // If we can't get the ID from the target it's probably because the user clicked
      // the arrow, we then retrieve the option's ID which is the parent element
      var id = e.target.dataset.id ? e.target.dataset.id : e.target.parentElement.dataset.id;
      this._navigateForward(id);
    },

    /**
     * Focus the next option in the select
     */
    _focusNextOption: function () {
      var steps = this.stepsContainer.children;
      var lastStep = steps[steps.length - 1];

      var options = lastStep.querySelectorAll('.js-option');
      var selectedOption = lastStep.querySelector('.js-option[aria-selected="true"]');

      if (!selectedOption) {
        // We highlight the first option
        options[0].setAttribute('aria-selected', true);
        options[0].focus();
      } else if (selectedOption.nextElementSibling) {
        // We highlight the next option
        selectedOption.setAttribute('aria-selected', false);
        selectedOption.nextElementSibling.setAttribute('aria-selected', true);
        selectedOption.nextElementSibling.focus();
      } else {
        // We reached the end of the options, we highlight the first again
        selectedOption.setAttribute('aria-selected', false);
        options[0].setAttribute('aria-selected', true);
        options[0].focus();
      }
    },

    /**
     * Focus the previous options in the select
     */
    _focusPreviousOption: function () {
      var steps = this.stepsContainer.children;
      var lastStep = steps[steps.length - 1];

      var options = lastStep.querySelectorAll('.js-option');
      var selectedOption = lastStep.querySelector('.js-option[aria-selected="true"]');

      if (!selectedOption) {
        // We highlight the last option
        options[options.length - 1].setAttribute('aria-selected', true);
        options[options.length - 1].focus();
      } else if (selectedOption.previousElementSibling) {
        // We highlight the next option
        selectedOption.setAttribute('aria-selected', false);
        selectedOption.previousElementSibling.setAttribute('aria-selected', true);
        selectedOption.previousElementSibling.focus();
      } else {
        // We reached the beginning of the options, we highlight the last again
        selectedOption.setAttribute('aria-selected', false);
        options[options.length - 1].setAttribute('aria-selected', true);
        options[options.length - 1].focus();
      }
    },

    /**
     * Reset the selector (and close it as a consequence)
     */
    reset: function () {
      // eslint-disable-next-line no-underscore-dangle
      this.options._path = [];
      this.render();
    },

    /**
     * Get the hierarchy for the current path
     * @returns {object}
     */
    _getHierarchy: function () {
      // eslint-disable-next-line no-underscore-dangle
      var path = this.options._path;

      var findNode = function (currentPath, currentNode) {
        if (!currentPath.length) {
          return currentNode;
        }

        for (var i = 0, j = currentNode.options.length; i < j; i++) {
          var node = currentNode.options[i];
          if (node.id === currentPath[0]) {
            var remainingPath = Array.prototype.slice.call(currentPath);
            remainingPath.shift();
            return findNode(remainingPath, node);
          }
        }

        // eslint-disable-next-line no-console
        console.warn('Unable to find the node ' + path.join('/'));
        return {};
      };

      // eslint-disable-next-line no-underscore-dangle
      return findNode(path, this.options.hierarchy);
    },

    /**
     * Expand the option to see its nested options
     * @param {string} id - id of the parent option
     */
    _navigateForward: function (id) {
      // eslint-disable-next-line no-underscore-dangle
      var level = this.options._path.length;

      // eslint-disable-next-line no-underscore-dangle
      this.options._path.push(id);

      // eslint-disable-next-line no-underscore-dangle
      var hierarchy = this._getHierarchy();

      // We went down to a leaf
      if (!hierarchy.options) {
        // We call the callback function with the path of ids
        // eslint-disable-next-line no-underscore-dangle
        this.options.onChange(this.options._path);

        // We close the dropdown and reset it
        this.reset();
      } else {
        // In case an option was highlighted, we change it
        var selectedOption = this.stepsContainer.querySelector('.js-option[aria-selected="true"]');
        if (selectedOption) {
          selectedOption.setAttribute('aria-selected', false);
        }

        // We make sure to update the tabbable options and the focus
        for (var i = 0, j = this.stepsContainer.children.length; i < j; i++) {
          var options = Array.prototype.slice.call(this.stepsContainer.children[i].querySelectorAll('.js-option'));
          options.forEach(function (option) { option.setAttribute('tabindex', '-1'); });
        }
        this.el.focus();

        // We append the new step to the DOM
        var templateData = Object.assign({}, hierarchy, { selectID: this.options.ID });
        this.stepsContainer.append($(this.stepTemplate(templateData))[0]);

        // We update the label with the current step name
        this.labelContainer.innerHTML = '<div class="arrow -left"></div>' + hierarchy.label;

        // We get the width of the steps container
        var stepWidth = this.stepsContainer.getBoundingClientRect().width;

        // We translate the options to the left
        this.stepsContainer.style.transform = 'translate(' + ((level + 1) * stepWidth * -1) + 'px, 0)';
      }
    },

    /**
     * Collapse the option to see its parent option
     */
    _navigateBackward: function () {
      // eslint-disable-next-line no-underscore-dangle
      var level = this.options._path.length - 1;

      // eslint-disable-next-line no-underscore-dangle
      this.options._path.pop();

      // eslint-disable-next-line no-underscore-dangle
      var hierarchy = this._getHierarchy();

      // We update the label with the current step name
      var label = hierarchy.label;
      this.labelContainer.innerHTML = (level === 0) ?
        label + '<div class="arrow"></div>' :
        '<div class="arrow -left"></div>' + label;

      // We get the width of the steps container
      var stepWidth = this.stepsContainer.getBoundingClientRect().width;

      // Function to remove the last step from the DOM
      var removeLastStep = function () {
        var stepToRemove = this.stepsContainer.children[this.stepsContainer.children.length - 1];
        this.stepsContainer.removeChild(stepToRemove);
        this.stepsContainer.removeEventListener('transitionend', removeLastStep);
      }.bind(this);

      // We remove the last step when the animation ends
      this.stepsContainer.addEventListener('transitionend', removeLastStep);

      // We translate the options to the left
      this.stepsContainer.style.transform = 'translate(' + (level * stepWidth * -1) + 'px, 0)';
    },

    /**
     * Toggle the visibility of the selector's options
     * @param {boolean} addClass - force the visibility
     */
    _toggle: function (addClass) {
      var params = ['-hidden'];
      if (typeof addClass === 'boolean') params.push(!addClass);
      var collapsed = this.stepsWrapperContainer.classList.toggle.apply(this.stepsWrapperContainer.classList, params);
      this.el.setAttribute('aria-expanded', !collapsed);

      // In case an option was highlighted, we change it
      var selectedOption = this.stepsContainer.querySelector('.js-option[aria-selected="true"]');
      if (selectedOption) selectedOption.setAttribute('aria-selected', false);
    },

    render: function () {
      if (!this.options.hierarchy) return;

      this.el.classList.add(this.className);
      this.el.setAttribute('tabindex', 0);
      this.el.setAttribute('role', 'combobox');
      this.el.setAttribute('aria-readonly', true);
      this.el.setAttribute('aria-expanded', false);
      this.el.innerHTML = this.template({ label: this.options.hierarchy.label, selectID: this.options.ID });

      this.labelContainer = this.el.querySelector('.js-label');
      this.stepsWrapperContainer = this.el.querySelector('.js-steps-wrapper');
      this.stepsContainer = this.el.querySelector('.js-steps');

      var templateData = Object.assign({}, this.options.hierarchy, { selectID: this.options.ID });
      this.stepsContainer.innerHTML = this.stepTemplate(templateData);
    }

  });
})(this.App));
