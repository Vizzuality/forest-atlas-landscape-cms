// TODO: @Clement, is this still necessary?

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import Wysiwyg from 'components/shared/Wysiwyg';

class OpenContentPreview extends React.Component {
  render() {
    const { admin } = this.props;
    return (
      <div className="vizz-wysiwyg">
        <Wysiwyg
          readOnly
          items={JSON.parse(admin.page.content) || []}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { admin: state.admin };
}

OpenContentPreview.propTypes = { admin: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(OpenContentPreview);
