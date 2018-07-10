import React from 'react';
import PropTypes from 'prop-types';

import Wysiwyg from 'vizz-wysiwyg';

import { ImageUpload, ImagePreview } from 'components/wysiwyg';
import Dashboard from 'components/shared/Dashboard';

class EditDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topContent: props.topContent,
      bottomContent: props.bottomContent
    };
  }

  render() {
    return (
      <div className="c-edit-dashboard">
        <input type="hidden" name="site_page[dashboard_setting][content_top]" value={this.state.topContent} />
        <input type="hidden" name="site_page[dashboard_setting][content_bottom]" value={this.state.bottomContent} />
        <Wysiwyg
          items={JSON.parse(this.props.topContent) || []}
          onChange={content => this.setState({ topContent: JSON.stringify(content) })}
          blocks={{
            image: {
              Component: ImagePreview,
              EditionComponent: ImageUpload,
              icon: 'icon-image',
              label: 'Image',
              renderer: 'tooltip'
            }
          }}
        />
        <Dashboard preview pageSlug="preview" dataset={this.props.dataset} widget={this.props.widget} />
        <Wysiwyg
          items={JSON.parse(this.props.bottomContent) || []}
          onChange={content => this.setState({ bottomContent: JSON.stringify(content) })}
          blocks={{
            image: {
              Component: ImagePreview,
              EditionComponent: ImageUpload,
              icon: 'icon-image',
              label: 'Image',
              renderer: 'tooltip'
            }
          }}
        />
      </div>
    );
  }
}

EditDashboard.propTypes = {
  dataset: PropTypes.string.isRequired,
  widget: PropTypes.string.isRequired,
  topContent: PropTypes.string,
  bottomContent: PropTypes.string
};

EditDashboard.defaultProps = {
  topContent: '',
  bottomContent: ''
};

export default EditDashboard;
