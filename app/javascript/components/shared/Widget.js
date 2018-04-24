import React from 'react';
import PropTypes from 'prop-types';

import { createClassFromSpec } from 'react-vega';

const BarSpec = createClassFromSpec('BarChart', {
  width: 400,
  height: 200,
  padding: 'strict',
  data: [
    {
      name: 'table',
      format: { parse: { year: 'date' } }
    }
  ],
  scales: [
    {
      name: 'xscale',
      type: 'ordinal',
      title: 'Year',
      nice: true,
      domain: { data: 'table', field: 'year' },
      range: 'width'
    },
    {
      name: 'yscale',
      type: 'linear',
      title: 'Month',
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
      },
      update: { fillOpacity: { value: 1 } },
      hover: { fillOpacity: { value: 0.5 } }
    }
  }]
});

export default function Widget({ data }) {
  const barData = { table: data };
  console.log(barData);
  return <BarSpec data={barData} />;
}

Widget.propTypes = {};
