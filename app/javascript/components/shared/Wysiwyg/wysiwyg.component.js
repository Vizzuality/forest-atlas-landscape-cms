import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VizzWysiwyg, { TextBlock as VizzTextBlock } from 'vizz-wysiwyg';
import { Icons } from 'widget-editor';
import omit from 'lodash/omit';
import pick from 'lodash/pick';

// FIXME:
import { WidgetBlock, WidgetBlockCreation, ImageUpload, ImagePreview, HtmlEmbedPreview } from './blocks';

const BLOCKS = {
  text: {
    Component: VizzTextBlock,
    placeholder: 'Type your text',
    theme: 'bubble',
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        [{ align: [] }]
      ]
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

const Wysiwyg = (props) => {
  const { blocks: blockNames, widgets } = props
  const vizzWysiwygProps = omit(props, ['blocks']);

  const blocks = pick(
    Object.assign({},
      BLOCKS,
      {
        widget: Object.assign({}, BLOCKS.widget, { widgets })
      }
    ),
    blockNames
  );

  return (
    <Fragment>
      <Icons />
      <VizzWysiwyg
        {...vizzWysiwygProps}
        blocks={blocks}
      />
    </Fragment>
  );
};


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
