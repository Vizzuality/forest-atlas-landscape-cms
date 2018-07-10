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

export const isAcceptedType = type => ALLOWED_FIELD_TYPES.findIndex(t => t.name === type) !== -1;
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

  return Object.assign(
    {
      fields: Object.assign(
        {
          x: {
            name: widget.widgetConfig.paramsConfig.category.name,
            aggregation: widget.widgetConfig.paramsConfig.aggregateFunction || null,
          }
        },
        widget.widgetConfig.paramsConfig.value
          ? { y: { name: widget.widgetConfig.paramsConfig.value.name } }
          : {}
      ),
      filters: widget.widgetConfig.paramsConfig.filters.map(f => ({ field: f.name, values: f.value, type: f.type, notNull: f.notNull || false })),
      limit: widget.widgetConfig.paramsConfig.limit || 500
    },
    widget.widgetConfig.paramsConfig.orderBy
      ? {
        order: {
          field: widget.widgetConfig.paramsConfig.orderBy.name,
          direction: widget.widgetConfig.paramsConfig.orderBy.orderType
        }
      }
      : {}
  );
};