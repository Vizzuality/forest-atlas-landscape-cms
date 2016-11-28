((function () {
  'use strict';

  var Embed = Quill.import('blots/block/embed');

  // Quill is built with ES6 classes and is transpiled with Babel. In order to extend a class
  // in ES5, we have to compile the ES6 extend with Babel

  // SOURCE:
  /*
    var Embed = Quill.import('blots/block/embed');

    class ImageBlot extends Embed {
      static create(value) {
        let node = super.create();
        node.setAttribute('alt', value.alt);
        node.setAttribute('src', value.url);
        return node;
      }

      static value(node) {
        return {
          alt: node.getAttribute('alt'),
          url: node.getAttribute('src')
        };
      }
    }

    ImageBlot.blotName = 'image';
    ImageBlot.tagName = 'img';
   */

  /* eslint-disable */
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var Embed = Quill.import('blots/block/embed');

  var ImageBlot = function (_Embed) {
    _inherits(ImageBlot, _Embed);

    function ImageBlot() {
      _classCallCheck(this, ImageBlot);

      return _possibleConstructorReturn(this, (ImageBlot.__proto__ || Object.getPrototypeOf(ImageBlot)).apply(this, arguments));
    }

    _createClass(ImageBlot, null, [{
      key: 'create',
      value: function create(value) {
        var node = _get(ImageBlot.__proto__ || Object.getPrototypeOf(ImageBlot), 'create', this).call(this);
        node.setAttribute('alt', value.alt);
        node.setAttribute('src', value.url);
        return node;
      }
    }, {
      key: 'value',
      value: function value(node) {
        return {
          alt: node.getAttribute('alt'),
          url: node.getAttribute('src')
        };
      }
    }]);

    return ImageBlot;
  }(Embed);
  /* eslint-enable */

  ImageBlot.blotName = 'image';
  ImageBlot.tagName = 'img';

  App.Blot.ImageBlot = ImageBlot;
})(this.App));
