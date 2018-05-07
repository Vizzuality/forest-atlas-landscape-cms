import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Wysiwyg from 'vizz-wysiwyg';

import { WidgetBlock, WidgetBlockCreation } from 'components/wysiwyg';

const EditDashboard = ({ admin }) => (
  <div className="l-page-list">
    <div className="wrapper">
      <h1>Dashboard Content</h1>
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
          }
        }}
      />
    </div>
  </div>
);

function mapStateToProps(state) {
  return { admin: state.admin };
}

EditDashboard.propTypes = { admin: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(EditDashboard);