import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { CoverPage, WysiwygEditor, Footer } from 'components';

import Wysiwyg from 'vizz-wysiwyg';
import { WidgetBlock, WidgetBlockCreation, ImageUpload, ImagePreview } from 'components/wysiwyg';


import { getDbContent } from 'utils';

const StaticPage = ({ site, version }) => (
  <div className="fa-page">
    <CoverPage site={site} secondary />
    {version <= 1 && <WysiwygEditor content={getDbContent(site.page.content)} />}
    {version > 1 && <Wysiwyg
      readOnly
      items={JSON.parse(site.page.content) || []}
      blocks={{
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
        }
      }}
    />}

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
