import React from 'react';
import PropTypes from 'prop-types';

import Wysiwyg, { TextBlock } from 'vizz-wysiwyg';

import { ImageUpload, ImagePreview, HtmlEmbedPreview } from 'components/wysiwyg';
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
        <input type="hidden" name="site_page[dashboard_setting][content_top]" value={this.state.topContent || ''} />
        <input type="hidden" name="site_page[dashboard_setting][content_bottom]" value={this.state.bottomContent || ''} />
        <Wysiwyg
          items={this.props.topContent ? JSON.parse(this.props.topContent) : []}
          onChange={content => this.setState({ topContent: JSON.stringify(content) })}
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
        />
        <Dashboard preview pageSlug="preview" dataset={this.props.dataset} widget={this.props.widget} />
        <Wysiwyg
          items={this.props.bottomContent ? JSON.parse(this.props.bottomContent) : []}
          onChange={content => this.setState({ bottomContent: JSON.stringify(content) })}
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
        />
      </div>
    );
  }
}

EditDashboard.propTypes = {
  dataset: PropTypes.string,
  widget: PropTypes.string,
  topContent: PropTypes.string,
  bottomContent: PropTypes.string
};

EditDashboard.defaultProps = {
  topContent: null,
  bottomContent: null,
  widget: null,
  dataset: null
};

export default EditDashboard;
