import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Utils
import { getDbContent } from 'utils';

// Components
import Wysiwyg from 'components/shared/Wysiwyg';
import { WysiwygEditor, Footer } from 'components';
import RelatedPages from 'components/public/RelatedPages';


const StaticPage = ({ site, version, relatedPages }) => (
  <div className="fa-page">
    {version <= 1 && <WysiwygEditor content={getDbContent(site.page.content)} />}
    {version > 1 && (
      <div className="vizz-wysiwyg">
        <Wysiwyg
          readOnly
          items={JSON.parse(site.page.content) || []}
        />
      </div>
    )}

    {relatedPages && relatedPages.length && <RelatedPages pages={relatedPages} />}

    <Footer site={site} />
  </div>
);

function mapStateToProps(state) {
  return { site: state.site };
}

StaticPage.propTypes = {
  version: PropTypes.number.isRequired,
  site: PropTypes.object.isRequired
};

export default connect(mapStateToProps, null)(StaticPage);
