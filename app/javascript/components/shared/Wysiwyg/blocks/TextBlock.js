import React from 'react';
import PropTypes from 'prop-types';

import LinkFormat from '../formats/LinkFormat';

class Text extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    block: PropTypes.object,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func
  }

  static defaultProps = {
    item: {},
    block: {},
    readOnly: false,
    onChange: null
  }

  constructor(props) {
    super(props);
    if (typeof window !== 'undefined') {
      /* eslint-disable */
      this.Editor = require('react-quill');

      // include any custom quill plugins here
      if (this.Editor) {
        this.Editor.Quill.register('formats/link', LinkFormat);
      }
      /* eslint-enable */
    }

    let content;

    try {
      content = JSON.parse(this.props.item.content);
    } catch (error) {
      content = this.props.item.content;
    }

    this.state = { content };
  }

  triggerChange = (content) => {
    this.setState({ content }, () => {
      if (this.props.onChange) {
        this.props.onChange({
          content: JSON.stringify(content)
        });
      }
    });
  }

  render() {
    const { block, readOnly } = this.props;
    const { content } = this.state;

    return (
      <div className="cw-wysiwyg-text">
        {(typeof document !== 'undefined') &&
          <this.Editor
            {...block}
            readOnly={readOnly}
            className="cw-quill"
            defaultValue={content}
            onChange={this.triggerChange}
          />
        }
      </div>
    );
  }
}

export default Text;
