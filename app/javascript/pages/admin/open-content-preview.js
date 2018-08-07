import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from 'widget-editor';

import { connect } from 'react-redux';

import Wysiwyg, { TextBlock } from 'vizz-wysiwyg';

import { WidgetBlock, WidgetBlockCreation, ImageUpload, ImagePreview, HtmlEmbedPreview } from 'components/wysiwyg';

class OpenContentPreview extends React.Component {
  render() {
    const { admin } = this.props;
    return (
      <div className="vizz-wysiwyg">
        <Icons />
        <Wysiwyg
          readOnly
          items={JSON.parse(admin.page.content) || []}
          blocks={{
            text: {
              Component: TextBlock,
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
            widget: {
              Component: WidgetBlock,
              EditionComponent: WidgetBlockCreation,
              admin,
              icon: 'icon-widget',
              label: 'Visualization',
              renderer: 'modal'
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
            }
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { admin: state.admin };
}

OpenContentPreview.propTypes = { admin: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(OpenContentPreview);
