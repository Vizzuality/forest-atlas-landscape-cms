export const CREATE_LAYER = 'CREATE_LAYER';
export const LOADING_MAP = 'LOADING_MAP';
export const ENDPOINT_TILES = 'https://geriux.cartodb.com/api/v1/map/';
export const CARTODB_USER = 'geriux';

function getLayerTypeSpec(type) {
  const spec = {
    layers: [{
      user_name: CARTODB_USER,
      type: 'cartodb',
      options: {
        sql: '',
        cartocss: '',
        cartocss_version: '2.3.0',
      }
    }]
  };

  if (type === 'raster') {
    const layerSpecOptions = spec.layers[0].options;
    layerSpecOptions.raster = true;
    layerSpecOptions.raster_band = 1;
    layerSpecOptions.geom_column = 'the_raster_webmercator';
    layerSpecOptions.geom_type = 'raster';
  }
  return spec;
}

function getLayerData(data) {
  const spec = Object.assign({}, getLayerTypeSpec(data.layer.type));
  const layerOptions = spec.layers[0].options;

  layerOptions.sql = data.layer.sql;
  layerOptions.cartocss = data.layer.cartocss;

  return JSON.stringify(spec);
}

export function createLayer(data) {
  return function (dispatch) {
    const slug = data.layer.slug;
    $.post({
      url: ENDPOINT_TILES,
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      data: getLayerData(data.layer),
    }).then((res) => {
      const tileUrl = `${ENDPOINT_TILES}${res.layergroupid}/{z}/{x}/{y}.png32`;
      dispatch({
        type: CREATE_LAYER,
        payload: {
          data: {
            slug: slug,
            tile: tileUrl
          }
        }
      });
    });
  };
}
