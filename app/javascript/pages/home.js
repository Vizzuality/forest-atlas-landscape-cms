import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import { Footer } from 'components';
import Wysiwyg from 'components/shared/Wysiwyg';

const Home = ({ site }) => (
  <div className="fa-page -homepage">
    {site.meta.siteTemplateName !== 'INDIA' && (
      <div className="vizz-wysiwyg c-content">
        <Wysiwyg
          readOnly
          items={JSON.parse(site.page.content) || []}
        />
      </div>
    )}
    <Footer site={site} />
  </div>
);

Home.propTypes = {
  site: PropTypes.shape({}).isRequired,
};

function mapStateToProps({ site }) {
  return { site };
}

export default connect(mapStateToProps)(Home);
