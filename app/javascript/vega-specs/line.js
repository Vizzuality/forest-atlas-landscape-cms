import { createClassFromSpec } from 'react-vega';

export default createClassFromSpec({
  width: 400,
  height: 200,
  padding: 'strict',
  data: [
    {
      name: 'table',
      format: {
        parse: {
          year: 'date'
        }
      }
    }
  ],
  scales: [
    {
      name: 'xscale',
      nice: true,
      type: 'time',
      zero: false,
      domain: { data: 'table', field: 'year' },
      range: 'width'
    },
    {
      name: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'month' },
      range: 'height'
    }
  ],
  axes: [
    {
      orient: 'bottom',
      scale: 'xscale',
      ticks: 6,
      tickSizeEnd: 0
    },
    { orient: 'left', scale: 'yscale' }
  ],
  marks: [
    {
      type: 'area',
      from: { data: 'table' },
      encode: {
        enter: {
          x: { scale: 'xscale', field: 'year' },
          y: { scale: 'yscale', field: 'month' },
          stroke: { value: '#97be32' },
          strokeWidth: { value: 2 }
        },
        update: { fillOpacity: { value: 1 } },
        hover: { fillOpacity: { value: 0.5 } }
      }
    }
  ]
});
