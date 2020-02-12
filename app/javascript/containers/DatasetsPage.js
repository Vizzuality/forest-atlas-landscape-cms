import React from 'react';
import PropTypes from 'prop-types';

import { Table, DatasetModal, Modal, Notification } from 'components';

import AdminContainer from 'containers/shared/AdminContainer';

class DatasetsPage extends React.Component {
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
    const { datasets } = this.props;
    const { deleteWarning, deleteSuccess, deleteError, selectedRow } = this.state;

    const rows = datasets.map(dataset => {
      dataset.created = { value: (new Date(dataset.created.value)).toLocaleString(), sortable: true };
      dataset.edited = { value: (new Date(dataset.edited.value)).toLocaleString(), sortable: true };
      return dataset;
    });

    return (
      <div className="l-page-list">
        {deleteWarning && (
          <Modal
            show={deleteWarning}
            onClose={() => this.setState({ deleteWarning: false })}
          >
            <div className="details-modal">
              <h1>Are you sure you want to delete this dataset?</h1>
              {selectedRow.widgets.value && (
                <div>
                  <p>The deletion can't be reversed and it will affect to the following widgets: </p>
                  <p>{selectedRow.widgets.value}</p>
                </div>
              )}
            </div>
            <footer>
              <button type="button" className="c-button -outline -dark-text" onClick={() => this.setState({ deleteWarning: false })}>
                Cancel
              </button>
              <button type="button" className="c-button" onClick={() => this.onClickDelete()}>
                Remove
              </button>
            </footer>
          </Modal>
        )}

        {deleteSuccess && (
          <Notification
            type="info"
            content="The dataset has been successfully deleted."
            onClose={() => this.setState({ deleteSuccess: false })}
          />
        )}

        {deleteError && (
          <Notification
            type="error"
            content="The dataset couldn't be deleted."
            onClose={() => this.setState({ deleteError: false })}
          />
        )}

        <AdminContainer>
          <div className="l-page-list">
            <div className="wrapper">
              <Table
                searchable
                columns={['title', 'contexts', 'connector', 'status', 'owner', 'created', 'edited']}
                data={rows}
                modal={DatasetModal}
                actions={['edit', 'delete']}
                onClickAction={(...params) => this.onClickAction(...params)}
              />
            </div>
          </div>
        </AdminContainer>
      </div>
    );
  }
}

DatasetsPage.propTypes = {
  datasets: PropTypes.array
};

DatasetsPage.defaultProps = {
  datasets: []
};

export default DatasetsPage;
