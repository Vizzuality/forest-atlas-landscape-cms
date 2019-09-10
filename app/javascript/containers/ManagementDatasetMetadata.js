import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import ManagementContainer from 'containers/shared/ManagementContainer';
import Tabs from 'components/shared/Tabs';


const Form = ({ languageCode, visible, initialData }) => (
  <div className={!visible ? 'hidden' : ''} aria-hidden={!visible}>
    <fieldset className="c-inputs-container">
      <legend>General</legend>
      <div className="container">
        <label htmlFor="dataset-metadata-description">
          Description{' '}
          <button type="button" className="info-button" data-tippy="Provides a brief description of your dataset. For ArcGIS services, the description will be imported from the Description in ArcGIS." data-tippy-interactive="true">Field information</button>
        </label>
        <textarea id="dataset-metadata-description" name={`[${languageCode}][description]`} defaultValue={initialData.description} />
      </div>
      <div className="container">
        <label htmlFor="dataset-metadata-citation">
          Citation{' '}
          <button type="button" className="info-button" data-tippy="Provides a full citation for your dataset." data-tippy-interactive="true">Field information</button>
        </label>
        <textarea id="dataset-metadata-citation" name={`[${languageCode}][citation]`} defaultValue={initialData.citation} />
      </div>
      <div className="container">
        <label htmlFor="dataset-metadata-cautions">
          Cautions{' '}
          <button type="button" className="info-button" data-tippy="Describes any limitations of the dataset that users should be aware of." data-tippy-interactive="true">Field information</button>
        </label>
        <textarea id="dataset-metadata-cautions" name={`[${languageCode}][cautions]`} defaultValue={initialData.cautions} />
      </div>
    </fieldset>

    <fieldset className="c-inputs-container">
      <legend>Data info</legend>
      <div className="container">
        <label htmlFor="dataset-metadata-function">
          Function{' '}
          <button type="button" className="info-button" data-tippy="Briefly describes the purpose of the dataset and what it represents (i.e. display areas under protection in the DRC)." data-tippy-interactive="true">Field information</button>
        </label>
        <textarea id="dataset-metadata-function" name={`[${languageCode}][function]`} defaultValue={initialData.function} />
      </div>
      <div className="container">
        <label htmlFor="dataset-metadata-source">
          Source{' '}
          <button type="button" className="info-button" data-tippy="Lists organizations which provided your data. If your datasource has multiple source, list them separated by a “,”." data-tippy-interactive="true">Field information</button>
        </label>
        <input type="text" id="dataset-metadata-source" name={`[${languageCode}][source]`} defaultValue={initialData.source} />
      </div>
      <div className="container">
        <label htmlFor="dataset-metadata-resolution">
          Resolution{' '}
          <button type="button" className="info-button" data-tippy="Describes the spatial resolution, e.g., 50 meters (50 m in parentheses), 500 × 500 meters (note use of times symbol instead of x), 15 arc second/minute/degree." data-tippy-interactive="true">Field information</button>
        </label>
        <input type="text" id="dataset-metadata-resolution" name={`[${languageCode}][resolution]`} defaultValue={initialData.resolution} />
      </div>
      <div className="container">
        <label htmlFor="dataset-metadata-geographic-coverage">
          Geographic coverage{' '}
          <button type="button" className="info-button" data-tippy="Describes the spatial extent of the dataset (i.e. Global, Georgia, Democratic Republic of the Congo)." data-tippy-interactive="true">Field information</button>
        </label>
        <input type="text" id="dataset-metadata-geographic-coverage" name={`[${languageCode}][geographic_coverage]`} defaultValue={initialData.geographic_coverage} />
      </div>
      <div className="container">
        <label htmlFor="dataset-metadata-frequency-updated">
          Frequency of updates{' '}
          <button type="button" className="info-button" data-tippy="Specify how often your dataset is updated (i.e. Quarterly, Monthly, Annually, Ad-hoc, varies)." data-tippy-interactive="true">Field information</button>
        </label>
        <input type="text" id="dataset-metadata-frequency-updated" name={`[${languageCode}][frequency_of_updates]`} defaultValue={initialData.frequency_of_updates} />
      </div>
      <div className="container">
        <label htmlFor="dataset-metadata-date-content">
          Date of content{' '}
          <button type="button" className="info-button" data-tippy="Specify date or time period that the data represents. If the dataset represents a static period in time specify the date when the dataset was last updated." data-tippy-interactive="true">Field information</button>
        </label>
        <input type="text" id="dataset-metadata-date-content" name={`[${languageCode}][date_of_content]`} defaultValue={initialData.date_of_content} />
      </div>
    </fieldset>

    <fieldset className="c-inputs-container">
      <legend>Links</legend>
      <div className="container">
        <label htmlFor="dataset-download-link">
          Download link{' '}
          <button type="button" className="info-button" data-tippy="Provides a url to a place where the user can download the original data. For example, ArcGIS Users could provide a link to the dataset on an Open Data Portal." data-tippy-interactive="true">Field information</button>
        </label>
        <input type="text" id="dataset-download-link" name={`[${languageCode}][download_data]`} defaultValue={initialData.download_data} />
      </div>
      <div className="container">
        <label htmlFor="dataset-amazon-link">
          Amazon link{' '}
          <button type="button" className="info-button" data-tippy="Provides a url to your dataset on Amazon S3, if available." data-tippy-interactive="true">Field information</button>
        </label>
        <input type="text" id="dataset-amazon-link" name={`[${languageCode}][amazon_link]`} defaultValue={initialData.amazon_link} />
      </div>
      <div className="container">
        <label htmlFor="dataset-map-service">
          ArcGIS Map Service or Feature Service Link{' '}
          <button type="button" className="info-button" data-tippy="Provides a url to the ArcGIS Map Service or Feature Service layer for your dataset (i.e. https://gis.forest-atlas.org/server/rest/services/cod/donnees_ouvertes_en/MapServer/80)." data-tippy-interactive="true">Field information</button>
        </label>
        <input type="text" id="dataset-map-service" name={`[${languageCode}][map_service]`} defaultValue={initialData.map_service} />
      </div>
      <div className="container">
        <label htmlFor="dataset-arcgis-online-id">
          ArcGIS Online ItemID Link{' '}
          <button type="button" className="info-button" data-tippy="Provides a url to the ArcGIS Online item for your datase (i.e. http://medd.maps.arcgis.com/home/item.html?id=d571abe7a30e4fefbe121f0680f01325)." data-tippy-interactive="true">Field information</button>
        </label>
        <input type="text" id="dataset-arcgis-online-id" name={`[${languageCode}][agol_link]`} defaultValue={initialData.agol_link} />
      </div>
    </fieldset>
  </div>
);

Form.propTypes = {
  languageCode: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  initialData: PropTypes.shape({}).isRequired,
};

const ManagementDatasetMetadata = ({ languages, defaultLanguage, metadata }) => {
  const languageOptions = Object.keys(languages).map(key => ({ name: languages[key], value: key }));
  const [selectedLanguageOption, setSelectedLanguageOption] = useState(
    languageOptions.find(o => o.value === defaultLanguage)
  );

  return (
    <ManagementContainer>
      <Fragment>
        <Tabs
          modifier="tertiary"
          tabs={languageOptions}
          selected={selectedLanguageOption.name}
          onChange={
            ({ name }) => setSelectedLanguageOption(languageOptions.find(o => o.name === name))
          }
        />
        <div className="l-dataset-creation -metadata">
          <div className="wrapper">
            {languageOptions.map(({ value }) => (
              <Form
                key={value}
                visible={value === selectedLanguageOption.value}
                languageCode={value}
                initialData={metadata[value]}
              />
            ))}
          </div>
        </div>
      </Fragment>
    </ManagementContainer>
  );
};

ManagementDatasetMetadata.propTypes = {
  /**
   * List of available languages
   * Example of value:
   * {
   *   en: 'English',
   *   fr: 'French'
   * }
   */
  languages: PropTypes.shape({}).isRequired,
  /**
   * Default language of the form
   * Example of value: 'en'
   */
  defaultLanguage: PropTypes.string.isRequired,
  /**
   * Metadata of the dataset for all the languages
   * Example of value:
   * {
   *   en: {},
   *   fr: {
   *     description: 'Blah blah blah'
   *   }
   * }
   */
  metadata: PropTypes.shape({}).isRequired,
};

export default ManagementDatasetMetadata;
