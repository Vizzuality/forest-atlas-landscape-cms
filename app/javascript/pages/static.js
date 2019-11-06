import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import Wysiwyg from 'components/shared/Wysiwyg';
import { Footer } from 'components';
import RelatedPages from 'components/public/RelatedPages';

const StaticPage = ({ site, relatedPages }) => (
  <div className="fa-page">
    <div className="vizz-wysiwyg">
      <Wysiwyg
        readOnly
        items={site.page.content ? JSON.parse(site.page.content) : []}
      />
    </div>

    {!!(relatedPages && relatedPages.length) && <RelatedPages pages={relatedPages} />}

    <Footer site={site} />
  </div>
);

StaticPage.propTypes = {
  site: PropTypes.shape({}).isRequired,
  relatedPages: PropTypes.arrayOf(PropTypes.object),
};

StaticPage.defaultProps = {
  relatedPages: [],
};

const mapStateToProps = ({ site }) => ({ site });

export default connect(mapStateToProps)(StaticPage);
