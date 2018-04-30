import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Wysiwyg from 'vizz-wysiwyg';

const Dashboard = ({ site }) => (
  <div className="fa-dashboard__widgetEditor">
    <Wysiwyg
      readOnly
      items={[
        { id: 1, type: 'text', content: '<h1>This is a title</h1>' },
        { id: 2, type: 'text', content: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>' },
        { id: 3, type: 'text', content: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>' },
        { id: 4, type: 'image', content: { src: 'https://media.istockphoto.com/photos/jordanian-dessert-at-sunrise-picture-id185099703?s=2048x2048', alt: 'Placeholder' } },
        { id: 6, type: 'grid', content: [{ id: 51, type: 'embed', content: { src: 'https://staging.resourcewatch.org/embed/widget/7592da9e-8844-429d-9f2b-0147dde29ff5' } }, { id: 52, type: 'embed', content: { src: 'https://staging.resourcewatch.org/embed/widget/acf093a0-c627-4ca7-9963-9cf1cc0c563e' } }] }
      ]}
    />
  </div>
);

function mapStateToProps(state) {
  return { site: state.site };
}

Dashboard.propTypes = { site: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(Dashboard);
