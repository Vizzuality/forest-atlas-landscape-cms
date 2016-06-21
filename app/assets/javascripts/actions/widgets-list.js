export const INIT = 'INIT';
export const LOADING = 'LOADING';
export const WIDGET_UPDATE = 'WIDGET_UPDATE';
export const ENDPOINT = 'http://api.resourcewatch.org:81';


function getWidgetEndpoint(widget) {
  return $.get(`${ENDPOINT}/widgets/${widget}`);
}

function getWidgetDatasetEndpoint(dataset) {
  return $.get(`${ENDPOINT}/${dataset.url}`).then((data) => {
    return {
      slug: dataset.slug,
      data: data
    };
  });
}

export function getWidgetsDataset(widgets, widgetsWithData) {
  return function (dispatch) {
    const widgetsList = [];
    const widgetsDatasets = widgetsWithData;

    widgets.forEach((widget) => {
      const current = widgetsDatasets[widget.slug];
      widgetsList.push(getWidgetDatasetEndpoint({
        url: current.data.query_url,
        slug: current.slug
      }));
    });

    $.when.apply($, widgetsList).then((...args) => {
      const response = args;

      response.forEach((current) => {
        const currentWidget = widgetsDatasets[current.slug];
        const chart = currentWidget.data.chart;

        currentWidget.dataset = current.data;

        chart.data.map((dataset) => {
          const chartDataset = dataset;

          if (chartDataset.name === 'table') {
            chartDataset.values = currentWidget.dataset.data;
          }

          return chartDataset;
        });
      });

      dispatch({
        type: WIDGET_UPDATE,
        payload: {
          data: widgets
        }
      });
    });
  };
}

export function getWidgetsData(widgets) {
  return function (dispatch) {
    const widgetsPromisesList = [];
    const widgetsWithData = {};

    widgets.forEach((widget) => {
      widgetsWithData[widget.slug] = widget;
      widgetsPromisesList.push(getWidgetEndpoint(widget.slug));
    });

    $.when.apply($, widgetsPromisesList).then((...args) => {
      const response = args;
      for (let x = 0; x < response.length; x++) {
        const current = response[x][0];
        widgetsWithData[current.slug].data = current;
      }

      dispatch(getWidgetsDataset(widgets, widgetsWithData));
    });
  };
}

export function init() {
  return function (dispatch) {
    $.get(`${ENDPOINT}/widgets`)
      .then((data) => {
        dispatch({
          type: INIT,
          payload: {
            data: data
          }
        });
        dispatch({
          type: LOADING,
          payload: {
            loading: false
          }
        });
        const widgetsList = Object.assign([], data);
        dispatch(getWidgetsData(widgetsList));
      });
  };
}
