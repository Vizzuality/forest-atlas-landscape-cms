((function () {
  'use strict';

  var Block = Quill.import('blots/block');

  // Quill is built with ES6 classes and is transpiled with Babel. In order to extend a class
  // in ES5, we have to compile the ES6 extend with Babel

  /* eslint-disable */
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  var IntroductionBlot = function (_Block) {
    _inherits(IntroductionBlot, _Block);

    function IntroductionBlot() {
      _classCallCheck(this, IntroductionBlot);

      return _possibleConstructorReturn(this, (IntroductionBlot.__proto__ || Object.getPrototypeOf(IntroductionBlot)).apply(this, arguments));
    }

    return IntroductionBlot;
  }(Block);
  /* eslint-enable */

  IntroductionBlot.blotName = 'intro';
  IntroductionBlot.tagName = 'div';
  IntroductionBlot.className = '-intro';

  App.Blot.IntroductionBlot = IntroductionBlot;
})(this.App));
