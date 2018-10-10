import { Quill } from 'react-quill';

const Inline = Quill.import('blots/inline');

function sanitize(url, protocols) {
  const anchor = document.createElement('a');
  anchor.href = url;
  const protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
  return protocols.indexOf(protocol) > -1;
}

class LinkFormat extends Inline {
  static create(value) {
    const node = super.create(value);
    const isString = typeof value === 'string';
    node.setAttribute('href', this.sanitize(isString ? value : value.href));
    node.setAttribute('target', isString ? '_blank' : value.target);
    return node;
  }

  static formats(domNode) {
    return {
      href: domNode.getAttribute('href'),
      target: domNode.getAttribute('target')
    };
  }

  static sanitize(url) {
    return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
  }

  format(name, value) {
    if (name !== this.statics.blotName || !value) {
      super.format(name, value);
    } else {
      this.domNode.setAttribute(name, name === 'href' ? this.constructor.sanitize(value) : value);
    }
  }
}

LinkFormat.blotName = 'link';
LinkFormat.tagName = 'A';
LinkFormat.SANITIZED_URL = 'about:blank';
LinkFormat.PROTOCOL_WHITELIST = ['http', 'https', 'mailto', 'tel'];

export default LinkFormat;
