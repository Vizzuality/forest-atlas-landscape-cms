import get from 'lodash/get';

const isEmptyMetadata = (metadata) => {
  const keys = [
    'description',
    'citation',
    'source',
    'applicationProperties.cautions',
    'applicationProperties.function',
    'applicationProperties.resolution',
    'applicationProperties.geographic_coverage',
    'applicationProperties.frequency_of_updates',
    'applicationProperties.date_of_content',
    'applicationProperties.download_data',
    'applicationProperties.amazon_link',
    'applicationProperties.map_service',
    'applicationProperties.agol_link',
  ];

  return keys.every((key) => {
    const value = get(metadata, key);
    return value === '' || value === undefined || value === null;
  });
};

export { isEmptyMetadata };
