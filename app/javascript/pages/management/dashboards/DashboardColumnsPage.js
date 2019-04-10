import React, { Fragment } from 'react';
import PropTypes, { object } from 'prop-types';

import { isAcceptedType, isAcceptedField } from 'helpers/api';

import Notification from 'components/Notification';
import Select from 'react-select';

class DashboardColumnsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      metadata: null,
      /** @type {string[]} */
      fields: [],
      /** @type {string[]} */
      selectedFields: props.selectedFields
    };
  }

  componentDidMount() {
    this.setState({ loading: true, error: false });
    this.fetchMetadata()
      .then(this.fetchFields())
      .catch(() => this.setState({ error: true }))
      .then(() => this.setState({ loading: false }));
  }

  fetchMetadata() {
    const { datasetId } = this.props;

    return fetch(`${ENV.API_URL}/dataset/${datasetId}?includes=metadata&application=${ENV.API_APPLICATIONS}&env=${ENV.API_ENV}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then(({ data }) => {
        if (data.attributes.metadata && data.attributes.metadata.length) {
          const FAMetadata = data.attributes.metadata.find(m => m.attributes.application === 'forest-atlas');
          const enMetadata = data.attributes.metadata.find(m => m.attributes.language === 'en');

          // We return, in priority, the metadata for forest-atlas or the one in English
          const metadata = FAMetadata || enMetadata || data.attributes.metadata[0];
          this.setState({ metadata });
        }
      });
  }

  fetchFields() {
    const { datasetId } = this.props;

    return fetch(`${ENV.API_URL}/fields/${datasetId}?application=${ENV.API_APPLICATIONS}&env=${ENV.API_ENV}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then(({ fields: rawFields }) => {
        const fields = Object.keys(rawFields)
          .filter(fieldName => isAcceptedType(rawFields[fieldName].type) && isAcceptedField(fieldName))
          .sort();

        this.setState({ fields });
      });
  }

  getFieldDisplayName(field) {
    const { metadata } = this.state;

    if (metadata && metadata.attributes.columns) {
      const fieldsMetadata = metadata.attributes.columns;
      if (Object.keys(fieldsMetadata).indexOf(field) !== -1) {
        const alias = fieldsMetadata[field].alias;
        return alias || field;
      }
    }

    return field;
  }

  render() {
    const { loading, error, fields, selectedFields } = this.state;

    return (
      <Fragment>
        {error && (
          <Notification
            type="error"
            content="Unable to get the columns of the dataset."
            onClose={() => this.setState({ error: false })}
          />
        )}
        <div className="c-inputs-container">
          <div className="container">
            <label htmlFor="columns">Columns to hide</label>
            <Select
              id="columns"
              multi
              options={fields.map(field => ({ value: field, label: this.getFieldDisplayName(field) }))}
              value={selectedFields.map(field => ({ value: field, label: this.getFieldDisplayName(field) }))}
              onChange={fields => this.setState({ selectedFields: fields.map(field => field.value) })}
              isDisabled={loading}
            />
            <input type="hidden" name="site_page[dashboard_setting][columns]" value={selectedFields} />
          </div>
        </div>
      </Fragment>
    );
  }
}

DashboardColumnsPage.propTypes = {
  datasetId: PropTypes.string.isRequired,
  selectedFields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DashboardColumnsPage;
