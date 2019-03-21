import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Table } from 'components';
import Notification from 'components/Notification';

class WidgetsPage extends React.Component {
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
    // eslint-disable-next-line camelcase
    const rows = this.props.widgets.map(({ widget, delete_url, edit_url }) => ({
      id: { value: widget.id },
      name: { value: widget.name, sortable: true },
      description: { value: widget.description },
      ...(edit_url ? { edit: { value: edit_url } } : {}),
      ...(delete_url ? { delete: { value: delete_url } } : {})
    }));

    const { deleteWarning, deleteSuccess, deleteError } = this.state;

    const actions = [
      ...(rows.length && rows[0].edit ? ['edit'] : []),
      ...(rows.length && rows[0].delete ? ['delete'] : [])
    ];

    return (
      <div className="l-page-list">
        {deleteWarning && (
          <Notification
            type="warning"
            content="Are you sure you want to delete this widget?"
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
            content="The widget has been successfully deleted."
            onClose={() => this.setState({ deleteSuccess: false })}
          />
        )}

        {deleteError && (
          <Notification
            type="error"
            content="The widget couldn't be deleted."
            onClose={() => this.setState({ deleteError: false })}
          />
        )}

        <div className="wrapper">
          <Table
            name="List of widgets"
            searchable
            columns={['name', 'description']}
            data={rows}
            actions={actions}
            onClickAction={(...params) => this.onClickAction(...params)}
          />
        </div>
      </div>
    );
  }
}

WidgetsPage.propTypes = {
  widgets: PropTypes.array.isRequired,
  admin: PropTypes.bool.isRequired
};

const mapStateToProps = ({ env }) => ({
  admin: env.admin
});

export default connect(mapStateToProps)(WidgetsPage);
