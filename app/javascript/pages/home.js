import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { CoverPage, WysiwygEditor, Footer } from 'components';

import { getDbContent } from 'utils';

import Wysiwyg from 'vizz-wysiwyg';
import { WidgetBlock, ImagePreview, HtmlEmbedPreview } from 'components/wysiwyg';

const Home = ({ site }) => (
  <div className="fa-page">
    <CoverPage site={site} />
    {/*  page content_type 9 equals homepagev2 */}
    {site.page.content_type === 9 ?
      <div className="vizz-wysiwyg c-content">
        <Wysiwyg
          readOnly
          items={JSON.parse(site.page.content) || []}
          blocks={{
            widget: {
              Component: WidgetBlock,
              icon: 'icon-widget',
              label: 'Visualization',
              renderer: 'modal'
            },
            image: {
              Component: ImagePreview,
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
      </div> : <WysiwygEditor content={getDbContent(site.page.content)} />}
    <Footer site={site} />
  </div>
);

function mapStateToProps(state) {
  return { site: state.site };
}

Home.propTypes = { site: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(Home);
