import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Wysiwyg from 'vizz-wysiwyg';

import { WidgetBlock, WidgetBlockCreation, ImageUpload, ImagePreview, HtmlEmbedPreview } from 'components/wysiwyg';

class OpenContentPreview extends React.Component {
  render() {
    const { admin } = this.props;
    console.log('hello', admin)
    return (
      <div className="vizz-wysiwyg">
        <Wysiwyg
          readOnly
          items={JSON.parse(admin.page.content) || []}
          blocks={{
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
