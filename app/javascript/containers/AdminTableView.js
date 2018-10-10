import React from 'react';
import PropTypes from 'prop-types';

import AdminContainer from 'containers/shared/AdminContainer';
import TableView from 'pages/admin/table-view';
import Notification from 'components/Notification';

class AdminTableView extends React.Component {
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
    const { deleteWarning, deleteSuccess, deleteError } = this.state;

    return (
      <AdminContainer>
        <div className="l-page-list">
          {deleteWarning && (
            <Notification
              type="warning"
              content="Are you sure you want to delete this item?"
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
              content="The item has been successfully deleted."
              onClose={() => this.setState({ deleteSuccess: false })}
            />
          )}

          {deleteError && (
            <Notification
              type="error"
              content="The item couldn't be deleted."
              onClose={() => this.setState({ deleteError: false })}
            />
          )}

          <TableView
            meta={this.props.meta}
            data={this.props.data}
            onClickAction={(...params) => this.onClickAction(...params)}
          />
        </div>
      </AdminContainer>
    );
  }
}

AdminTableView.propTypes = {
  meta: PropTypes.object.isRequired,
  data: PropTypes.array
};

AdminTableView.defaultProps = {
  data: []
};

export default AdminTableView;
