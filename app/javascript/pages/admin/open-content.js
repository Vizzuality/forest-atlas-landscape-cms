import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Wysiwyg from 'vizz-wysiwyg';

import { WidgetBlock, WidgetBlockCreation, ImageUpload, ImagePreview } from 'components/wysiwyg';

class OpenContent extends React.Component {
  render() {
    const { admin } = this.props;
    return (
      <div className="wrapper">
        <Wysiwyg
          items={JSON.parse(admin.page.content) || []}
          onChange={(d) => {
            const el = document.getElementById('site_page_content');
            if (el) {
              el.value = JSON.stringify(d);
            }
          }}
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

OpenContent.propTypes = { admin: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(OpenContent);
