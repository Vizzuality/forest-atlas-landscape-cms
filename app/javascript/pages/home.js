import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { CoverPage, WysiwygEditor, Footer } from 'components';

import { getDbContent } from 'utils';

import Wysiwyg, { TextBlock } from 'vizz-wysiwyg';
import { WidgetBlock, ImagePreview, HtmlEmbedPreview } from 'components/wysiwyg';

const Home = ({ site }) => (
  <div className="fa-page">
    <CoverPage site={site} />
    {site.page.page_version >= 2 ?
      <div className="vizz-wysiwyg c-content">
        <Wysiwyg
          readOnly
          items={JSON.parse(site.page.content) || []}
          blocks={{
            text: {
              Component: TextBlock,
              placeholder: 'Type your text',
              theme: 'bubble',
              modules: {
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link'],
                  [{ align: [] }]
                ]
              }
            },
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
