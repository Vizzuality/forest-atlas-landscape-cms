import React from 'react';
import PropTypes from 'prop-types';

import { BarGraph } from 'vega-specs/bar';

export default function Widget({ data }) {
  const barData = { table: data };
  return <BarGraph data={barData} />;
}

Widget.propTypes = {
  data: PropTypes.array.isRequired
};
