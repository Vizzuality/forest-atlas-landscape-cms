import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Wysiwyg from 'vizz-wysiwyg';

import { WidgetBlock, WidgetBlockCreation, ImageUpload, ImagePreview } from 'components/wysiwyg';

const EditDashboard = ({ admin }) => (
  <div className="wrapper vizz-wysiwyg">
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

function mapStateToProps(state) {
  return { admin: state.admin };
}

EditDashboard.propTypes = { admin: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(EditDashboard);
