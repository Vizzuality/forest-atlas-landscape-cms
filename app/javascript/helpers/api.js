export const ALLOWED_FIELD_TYPES = [
  // --- NUMBER ----
  { name: 'esriFieldTypeSmallInteger', type: 'number' },
  { name: 'esriFieldTypeInteger', type: 'number' },
  { name: 'esriFieldTypeSingle', type: 'number' },
  { name: 'esriFieldTypeDouble', type: 'number' },
  { name: 'numeric', type: 'number' },
  { name: 'number', type: 'number' },
  { name: 'int', type: 'number' },
  { name: 'integer', type: 'number' },
  { name: 'float', type: 'number' },
  { name: 'long', type: 'number' },
  { name: 'double', type: 'number' },
  { name: 'real', type: 'number' },
  { name: 'decimal', type: 'number' },
  // ----- TEXT -----
  { name: 'string', type: 'string' },
  { name: 'char', type: 'string' },
  { name: 'varchar', type: 'string' },
  { name: 'esriFieldTypeString', type: 'string' },
  { name: 'text', type: 'string' },
  // ----- DATE ----
  { name: 'esriFieldTypeDate', type: 'date' },
  { name: 'date', type: 'date' },
  { name: 'time', type: 'date' },
  { name: 'timestamp', type: 'date' },
  { name: 'interval', type: 'date' },
  // ------ BOOLEAN -----
  { name: 'boolean', type: 'boolean' },
  // ------ ARRAY -------
  { name: 'array', type: 'array' }
];

export const FORBIDDEN_FIELDS = [
  '_id',
  'cartodb_id'
];

export const isAcceptedType = type => ALLOWED_FIELD_TYPES.findIndex(t => t.name === type) !== -1;
export const isAcceptedField = field => FORBIDDEN_FIELDS.findIndex(f => f === field) === -1;
export const getStandardType = type => ALLOWED_FIELD_TYPES.find(t => t.name === type)
  ? ALLOWED_FIELD_TYPES.find(t => t.name === type).type
  : null;
export const isMapWidget = widget => !!widget && !!widget.widgetConfig && ((!!widget.widgetConfig.paramsConfig && widget.widgetConfig.paramsConfig.visualizationType === 'map') || widget.widgetConfig.type === 'map');
export const isVegaWidget = widget => !!widget && !!widget.widgetConfig && !!widget.widgetConfig.paramsConfig && widget.widgetConfig.paramsConfig.visualizationType === 'chart';
export const getWidgetsFromDataset = dataset => dataset && dataset.attributes.widget && dataset.attributes.widget.length
  ? dataset.attributes.widget.map(w => Object.assign({}, { id: w.id }, w.attributes))
  : [];

/**
 * Return the configuration of the query of a Vega widget
 */
export const getVegaWidgetQueryParams = (widget) => {
  if (!widget || !widget.widgetConfig || !widget.widgetConfig.paramsConfig) {
    return {};
  }

  // We use the sort order as defined in paramsConfig
  // but we also set defaults for some charts as defined in
  // https://github.com/resource-watch/widget-editor/blob/1e3aea74533a982dde8f4cb1e90208f299857cde/src/helpers/WidgetHelper.js#L337
  let orderBy = null;
  if (widget.widgetConfig.paramsConfig.orderBy) {
    orderBy = {
      field: widget.widgetConfig.paramsConfig.orderBy.name,
      direction: widget.widgetConfig.paramsConfig.orderBy.orderType
    };
  } else if (widget.widgetConfig.paramsConfig.chartType === 'line') {
    orderBy = {
      field: widget.widgetConfig.paramsConfig.category.name,
      direction: 'desc'
    };
  } else if (widget.widgetConfig.paramsConfig.value && ['pie', 'bar', 'stacked-bar', 'bar-horizontal', 'stacked-bar-horizontal'].indexOf(widget.widgetConfig.paramsConfig.chartType) !== -1) {
    orderBy = {
      field: widget.widgetConfig.paramsConfig.value.name,
      direction: 'desc'
    };
  }

  // The API doesn't support queries with ORDER BY count(yyy)
  // Again, the reference is here:
  // https://github.com/resource-watch/widget-editor/blob/1e3aea74533a982dde8f4cb1e90208f299857cde/src/helpers/WidgetHelper.js#L345
  if (widget.widgetConfig.paramsConfig.value && widget.widgetConfig.paramsConfig.aggregateFunction
    && orderBy && orderBy.field === widget.widgetConfig.paramsConfig.value.name) {
    orderBy.field = 'y';
  }

  return Object.assign(
    {
      fields: Object.assign(
        {
          x: { name: widget.widgetConfig.paramsConfig.category.name }
        },
        widget.widgetConfig.paramsConfig.value
          ? {
            y: {
              name: widget.widgetConfig.paramsConfig.value.name,
              aggregation: widget.widgetConfig.paramsConfig.aggregateFunction || null
            }
          }
          : {},
        widget.widgetConfig.paramsConfig.color
          ? {
            color: {
              name: widget.widgetConfig.paramsConfig.color.name
            }
          }
          : {},
      ),
      filters: widget.widgetConfig.paramsConfig.filters.map(f => ({
        name: f.name,
        values: f.value,
        type: f.type,
        operation: f.operation,
        notNull: f.notNull || false
      })),
      limit: widget.widgetConfig.paramsConfig.limit || 500
    },
    orderBy
      ? { order: { ...orderBy } }
      : {}
  );
};

/**
 * Return the serialized filters as they would be in an SQL query
 * The filters can be gotten from getVegaWidgetQueryParams
 * @param {{ type?: string, operation?: string, name: string, value: any, notNull?: boolean }[]} filters
 * @param {string} provider Provider of the dataset
 */
export const getSqlFilters = (filters, provider) => {
  return filters.map((filter) => {
    if (filter.values === null || filter.values === undefined) {
      return null;
    }

    if (filter.type === 'string') {
      let whereClause;
      switch (filter.operation) {
        case 'contains':
          whereClause = `${filter.name} LIKE '%${filter.values}%'`;
          break;

        case 'not-contain':
          whereClause = `${filter.name} NOT LIKE '%${filter.values}%'`;
          break;

        case 'starts-with':
          whereClause = `${filter.name} LIKE '${filter.values}%'`;
          break;

        case 'ends-with':
          whereClause = `${filter.name} LIKE '%${filter.values}'`;
          break;

        case '=':
          whereClause = `${filter.name} LIKE '${filter.values}'`;
          break;

        case '!=':
          whereClause = `${filter.name} NOT LIKE '${filter.values}'`;
          break;

        case 'by-values':
        default:
          whereClause = `${filter.name} IN ('${filter.values.join('\', \'')}')`;
          break;
      }

      return filter.notNull ? `${whereClause} AND ${filter.name} IS NOT NULL` : whereClause;
    }

    if (filter.type === 'number') {
      let whereClause;
      switch (filter.operation) {
        case 'not-between':
          whereClause = `${filter.name} < ${filter.values[0]} OR ${filter.name} > ${filter.values[1]}`;
          break;

        case '>':
          whereClause = `${filter.name} > ${filter.values}`;
          break;

        case '>=':
          whereClause = `${filter.name} >= ${filter.values}`;
          break;

        case '<':
          whereClause = `${filter.name} < ${filter.values}`;
          break;

        case '<=':
          whereClause = `${filter.name} <= ${filter.values}`;
          break;

        case '=':
          whereClause = `${filter.name} = ${filter.values}`;
          break;

        case '!=':
          whereClause = `${filter.name} <> ${filter.values}`;
          break;

        case 'between':
        default:
          whereClause = `${filter.name} >= ${filter.values[0]} AND ${filter.name} <= ${filter.values[1]}`;
          break;
      }

      return filter.notNull ? `${whereClause} AND ${filter.name} IS NOT NULL` : whereClause;
    }

    if (filter.type === 'date') {
      let whereClause;
      const getSerializedValue = v => (provider === 'featureservice' ? `date '${new Date(v).toISOString().split('T')[0]}'` : `'${v}'`);

      switch (filter.operation) {
        case 'not-between':
          whereClause = `${filter.name} < ${getSerializedValue(filter.values[0])} OR ${filter.name} > ${getSerializedValue(filter.values[1])}`;
          break;

        case '>':
          whereClause = `${filter.name} > ${getSerializedValue(filter.values)}`;
          break;

        case '>=':
          whereClause = `${filter.name} >= ${getSerializedValue(filter.values)}`;
          break;

        case '<':
          whereClause = `${filter.name} < ${getSerializedValue(filter.values)}`;
          break;

        case '<=':
          whereClause = `${filter.name} <= ${getSerializedValue(filter.values)}`;
          break;

        case '=':
          whereClause = `${filter.name} = ${getSerializedValue(filter.values)}`;
          break;

        case '!=':
          whereClause = `${filter.name} <> ${getSerializedValue(filter.values)}`;
          break;

        case 'between':
        default:
          whereClause = `${filter.name} >= ${getSerializedValue(filter.values[0])} AND ${filter.name} <= ${getSerializedValue(filter.values[1])}`;
          break;
      }

      return filter.notNull ? `${whereClause} AND ${filter.name} IS NOT NULL` : whereClause;
    }

    return null;
  }).filter(filter => !!filter)
    .join(' AND ');
};

/**
 * Return the URLs to download the data of a dataset
 * @param {string} datasetId ID of the dataset
 * @param {string} datasetProvider Provider of the dataset
 * @param {string} sqlQuery SQL query to apply to the dataset
 */
export const getDatasetDownloadUrls = (datasetId, datasetProvider, sqlQuery) => {
  if (!sqlQuery || !datasetProvider) return {};

  // The API doesn't implement the endpoint to download
  // a dataset for all the providers, and when it does,
  // it doesn't always expose the same formats
  // https://github.com/resource-watch/doc-api/pull/24
  const canDownloadCSV = ['rasdaman', 'nexgddp', 'loca', 'gee'].indexOf(datasetProvider) === -1;
  const canDownloadJSON = ['rasdaman', 'nexgddp', 'loca'].indexOf(datasetProvider) === -1;

  const query = `${ENV.API_URL}/download/${datasetId}?sql=${sqlQuery}`;
  return {
    ...(canDownloadCSV ? { csv: `${query}&format=csv` } : {}),
    ...(canDownloadJSON ? { json: `${query}&format=json` } : {})
  };
};
