import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Wysiwyg from 'vizz-wysiwyg';

import { WidgetBlock, WidgetBlockCreation, ImageUpload, ImagePreview, HtmlEmbedPreview } from 'components/wysiwyg';

class MigrateHomepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldCopy: null,
      newCopy: null
    };
  }

  componentDidMount() {
    const oldCopy = document.querySelector('.js-json-content').value;
    this.setState({ oldCopy });
  }

  finishMigration(e) {
    e.preventDefault();
    if (window.confirm('Are you sure?')) {
      const node = document.querySelector('.js-json-content');
      node.value = JSON.stringify(this.state.newCopy);
      document.querySelector('.c-wysiwyg').style.display = 'none';
    }
  }

  render() {
    const { admin } = this.props;
    return (
      <div className="vizz-wysiwyg">
        <Wysiwyg
          items={[{ id: 1532352632454, type: 'text', content: 'Copy and paste old content here' }]}
          onChange={(d) => {
            this.setState({ newCopy: d });
          }}
          blocks={{
            widget: {
              Component: WidgetBlock,
              EditionComponent: WidgetBlockCreation,
              admin,
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
        />
        <button onClick={e => this.finishMigration(e)}>Im done</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { admin: state.admin };
}

MigrateHomepage.propTypes = { admin: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(MigrateHomepage);
