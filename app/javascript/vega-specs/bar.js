import { createClassFromSpec } from 'react-vega';

export default createClassFromSpec({
  width: 400,
  height: 200,
  padding: 'strict',
  data: [{ name: 'table' }],
  scales: [
    {
      name: 'xscale',
      type: 'ordinal',
      domain: { data: 'table', field: 'year' },
      range: 'width'
    },
    {
      name: 'yscale',
      type: 'linear',
      nice: true,
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

  marks: [{
    type: 'rect',
    from: { data: 'table' },
    encode: {
      enter: {
        x: { scale: 'xscale', field: 'year', offset: 10 },
        width: {
          scale: 'xscale',
          band: true,
          offset: -15
        },
        y: { scale: 'yscale', field: 'month' },
        y2: {
          scale: 'yscale',
          value: 0
        }
      }
    }
  }]
});
