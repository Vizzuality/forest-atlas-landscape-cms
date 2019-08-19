// TODO: @Clement, is this still necessary?

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import Wysiwyg from 'components/shared/Wysiwyg';

class OpenContent extends React.Component {
  render() {
    const { admin } = this.props;
    return (
      <div className="vizz-wysiwyg">
        <Wysiwyg
          items={JSON.parse(admin.page.content) || []}
          widgets={admin.widgets}
          onChange={(d) => {
            const el = document.getElementById('site_page_content');
            if (el) {
              el.value = JSON.stringify(d);
            }
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { admin: state.admin };
}

OpenContent.propTypes = { admin: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(OpenContent);
