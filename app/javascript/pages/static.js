import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Icons } from 'widget-editor';

import { CoverPage, WysiwygEditor, Footer } from 'components';

import Wysiwyg, { TextBlock } from 'vizz-wysiwyg';
import { WidgetBlock, WidgetBlockCreation, ImageUpload, ImagePreview, HtmlEmbedPreview } from 'components/wysiwyg';

import { getDbContent } from 'utils';

const StaticPage = ({ site, version }) => (
  <div className="fa-page">
    <Icons />
    <CoverPage site={site} secondary />
    {version <= 1 && <WysiwygEditor content={getDbContent(site.page.content)} />}
    {version > 1 && <div className="vizz-wysiwyg"><Wysiwyg
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
          EditionComponent: WidgetBlockCreation,
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
        },
        html: {
          Component: HtmlEmbedPreview,
          icon: 'icon-embed',
          label: 'Custom HTML',
          renderer: 'tooltip'
        }
      }}
    /></div>}

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
