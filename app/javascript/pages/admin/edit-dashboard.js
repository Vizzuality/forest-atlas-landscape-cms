import React from 'react';
import PropTypes from 'prop-types';

// Components
import Wysiwyg from 'components/shared/Wysiwyg';
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
          blocks={['text', 'image', 'html']}
        />
        <Dashboard preview pageSlug="preview" dataset={this.props.dataset} widget={this.props.widget} />
        <Wysiwyg
          items={this.props.bottomContent ? JSON.parse(this.props.bottomContent) : []}
          onChange={content => this.setState({ bottomContent: JSON.stringify(content) })}
          blocks={['text', 'image', 'html']}
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
