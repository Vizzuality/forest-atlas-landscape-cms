import React from 'react';
import PropTypes from 'prop-types';

import { Table } from 'components';
import Notification from 'components/Notification';

class SiteListPages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRow: null,
      deleteWarning: false,
      deleteSuccess: false,
      deleteError: false
    };
  }

  onClickAction(action, row) {
    if (action === 'delete') {
      this.setState({ deleteWarning: true, selectedRow: row });
    } else if (action == 'toggle') {
      fetch(window.location.origin + row.enable.value, {
        method: 'PUT',
        credentials: 'same-origin'
      }).then(() => {
        window.location.reload();
      });
    } else {
      window.location = row.edit.value;
    }
  }

  onClickDelete() {
    const { selectedRow } = this.state;
    fetch(selectedRow.delete.value, {
      method: 'DELETE',
      credentials: 'include'
    }).then(() => {
      window.location.reload();
    }).catch(() => {
      this.setState({
        deleteSuccess: false,
        deleteError: true,
        deleteWarning: false
      });
    });
  }

  render() {
    const { pages } = this.props;
    const { deleteWarning, deleteSuccess, deleteError } = this.state;

    return (
      <div className="l-page-list">
        {deleteWarning && (
          <Notification
            type="warning"
            content="Are you sure you want to delete this page?"
            additionalContent="The deletion can't be reversed."
            dialogButtons
            closeable={false}
            onCancel={() => this.setState({ deleteWarning: false })}
            onContinue={() => this.onClickDelete()}
            onClose={() => this.setState({ deleteWarning: false })}
          />
        )}

        {deleteSuccess && (
          <Notification
            type="info"
            content="The page has been successfully deleted."
            onClose={() => this.setState({ deleteSuccess: false })}
          />
        )}

        {deleteError && (
          <Notification
            type="error"
            content="The page couldn't be deleted."
            onClose={() => this.setState({ deleteError: false })}
          />
        )}

        <div className="wrapper">
          <Table
            name="List of pages"
            searchable
            columns={['title', 'url', 'type']}
            data={pages}
            actions={['toggle', 'edit', 'delete']}
            onClickAction={(...params) => this.onClickAction(...params)}
          />
        </div>
      </div>
    );
  }
}

SiteListPages.propTypes = {
  pages: PropTypes.array.isRequired
};

export default SiteListPages;
