import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Utils
import { getDbContent } from 'utils';

// Components
import Wysiwyg from 'components/shared/Wysiwyg';
import { WysiwygEditor, Footer } from 'components';
import RelatedPages from 'components/public/RelatedPages';
import { AccordionWrapper } from 'components/shared/Accordion/accordion-wrapper';


const StaticPage = ({ site, version, relatedPages }) => (
  <div className="fa-page">
    {version <= 1 && <WysiwygEditor content={getDbContent(site.page.content)} />}
    {version > 1 && (renderContent(site))}

    {!!(relatedPages && relatedPages.length) && <RelatedPages pages={relatedPages} />}

    <Footer site={site} />
  </div>
);

const renderContent = ({ page: { content: contentStr }, meta }) => {
  let content = JSON.parse(contentStr);
  if (meta.siteTemplateName === 'INDIA') {
    if (content.length > 0 && content[0].content.includes('Template:CollapsibleContent')) {
      return (<div className="vizz-wysiwyg" style={{paddingTop: '10px', paddingBottom: '10px'}}> 
        <Wysiwyg
          readOnly
          items={[content[1]] || []}
        />
        <AccordionWrapper style={{ marginLeft: '10px',paddingTop: '10px' }} contents={content.slice(2)} />
    </div>)
    }
  }
  return <div className="vizz-wysiwyg">
    <Wysiwyg
      readOnly
      items={content || []}
    />
  </div>
}

function mapStateToProps(state) {
  return { site: state.site };
}

StaticPage.propTypes = {
  version: PropTypes.number.isRequired,
  site: PropTypes.object.isRequired
};

export default connect(mapStateToProps, null)(StaticPage);
