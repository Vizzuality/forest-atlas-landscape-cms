import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Utils
import { getDbContent } from 'utils';

// Components
import { WysiwygEditor, Footer } from 'components';
import Wysiwyg from 'components/shared/Wysiwyg';

const Home = ({ site }) => {
  return (
    <div className="fa-page">
      {site.meta.siteTemplateName !== 'INDIA' && <React.Fragment>
        {site.page.page_version >= 2 ?
          <div className={'vizz-wysiwyg c-content'}>
            <Wysiwyg
              readOnly
              items={JSON.parse(site.page.content) || []}
            />
          </div> : <WysiwygEditor content={getDbContent(site.page.content)} />}
        </React.Fragment>}
      <Footer site={site} />
    </div>
  );
};

function mapStateToProps(state) {
  return { site: state.site };
}

Home.propTypes = { site: PropTypes.object.isRequired, siteTemplateName: PropTypes.string };

export default connect(mapStateToProps, null)(Home);
