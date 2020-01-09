/**
 * Return a promise with the list of metadatas associated with the dataset
 * @param {string} datasetId ID of the dataset
 * @returns {Promise<Object[]>}
 */
const getDatasetMetadata = datasetId => fetch(`${ENV.API_URL}/dataset/${datasetId}?includes=metadata&application=${ENV.API_APPLICATIONS}&env=${ENV.API_ENV}`)
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error(res.statusText);
  })
  .then(({ data }) => data.attributes.metadata);

/**
 * Return which languages the dataset as alias metadata info for
 * @param {string} datasetId ID of the dataset
 * @returns {Promise<string[]>}
 */
const getMetadataLanguagesWithAliasInfo = async (datasetId) => {
  const isRelevant = str => str !== null && str !== undefined && str.length > 0;

  try {
    const metadatas = await getDatasetMetadata(datasetId);
    const relevantMetadatas = metadatas.filter((metadata) => {
      if (!metadata.attributes.columns) {
        return false;
      }

      return Object.keys(metadata.attributes.columns)
        .some(column => isRelevant(metadata.attributes.columns[column].alias)
          || isRelevant(metadata.attributes.columns[column].description));
    });

    return relevantMetadatas.map(metadata => metadata.attributes.language);
  } catch (e) {
    return [];
  }
};

/**
 * Return the best language to display the (alias) metadata info in
 * @param {string} datasetId ID of the dataset
 * @param {string} defaultLanguage Default language to use
 * @returns {Promise<string>}
 */
export const getMostAppropriateMetadataLanguage = (datasetId, defaultLanguage) => getMetadataLanguagesWithAliasInfo(datasetId)
  .then((languages) => {
    if (languages.indexOf(defaultLanguage) !== -1) {
      return defaultLanguage;
    }

    return languages[0] || defaultLanguage;
  })
  .catch(() => defaultLanguage);
