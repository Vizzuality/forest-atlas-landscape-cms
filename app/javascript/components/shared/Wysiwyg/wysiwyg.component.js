import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VizzWysiwyg from 'vizz-wysiwyg';
import { Icons } from 'widget-editor';
import omit from 'lodash/omit';
import pick from 'lodash/pick';

// Components
import { WidgetBlock, WidgetBlockCreation, ImageUpload, ImagePreview, HtmlEmbedPreview, TextBlock } from './blocks';
import LinkHandler from './handlers/LinkHandler';

const BLOCKS = {
  text: {
    Component: TextBlock,
    placeholder: 'Type your text',
    theme: 'bubble',
    modules: {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          [{ align: [] }]
        ],
        handlers: {}
      },
    }
  },
  image: {
    Component: ImagePreview,
    EditionComponent: ImageUpload,
    icon: 'icon-image',
    label: 'Image',
    renderer: 'tooltip'
  },
  html: {
    Component: HtmlEmbedPreview,
    icon: 'icon-embed',
    label: 'Custom HTML',
    renderer: 'tooltip'
  },
  widget: {
    Component: WidgetBlock,
    EditionComponent: WidgetBlockCreation,
    icon: 'icon-widget',
    label: 'Visualization',
    renderer: 'modal'
  }
};

class Wysiwyg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      linkHanderOpened: false
    };
  }

  /**
   * Return the blocks of the wysiwyg
   */
  getBlocks() {
    const { blocks: blockNames, widgets } = this.props

    const blocks = pick(
      Object.assign({},
        BLOCKS,
        {
          widget: Object.assign({}, BLOCKS.widget, { widgets })
        }
      ),
      blockNames
    );

    // We add the toolbar handlers
    if (blocks.text && blocks.text.modules && blocks.text.modules.toolbar) {
      const self = this;
      blocks.text.modules.toolbar.handlers = {
        link: function() {
          self.quill = this.quill;
          self.setState({ linkHanderOpened: true });
        }
      };
    }

    return blocks;
  }

  render() {
    const { linkHanderOpened } = this.state;
    const vizzWysiwygProps = omit(this.props, ['blocks']);

    const blocks = this.getBlocks();

    return (
      <Fragment>
        <Icons />
        <VizzWysiwyg
          {...vizzWysiwygProps}
          blocks={blocks}
        />
        { linkHanderOpened && (
          <LinkHandler quill={this.quill} onClose={() => this.setState({ linkHanderOpened: false }) } />
        )}
      </Fragment>
    );
  }
}


Wysiwyg.propTypes = {
  // Name of the blocks to include (see the default props)
  blocks: PropTypes.arrayOf(PropTypes.string),
  // List of the widgets
  widgets: PropTypes.arrayOf(PropTypes.object)
};

Wysiwyg.defaultProps = {
  blocks: ['text', 'image', 'html', 'widget'],
  widgets: []
}

export default Wysiwyg;
