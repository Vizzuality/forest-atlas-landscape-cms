import React from 'react';

class VegaChart extends React.Component {

  componentDidMount() {
    this.parseVega();
  }

  componentDidUpdate() {
    this.parseVega();
  }

  getData() {
    const { data, width, height } = this.props;
    let dataObj = {};

    if (typeof data === 'object') {
      dataObj = data;
    } else if (typeof data === 'string') {
      dataObj = JSON.parse(data);
    }

    dataObj.width = width;
    dataObj.height = height;

    return dataObj;
  }

  parseVega() {
    const dataObj = this.getData();
    vg.parse.spec(dataObj, chart => {
      const chartVis = chart({
        el: this.refs.vegaChart
      });

      chartVis.update();
    });
  }

  render() {
    return (
      <div ref="vegaChart" className="c-vega"></div>
    );
  }
}

VegaChart.propTypes = {
  data: React.PropTypes.any.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired
};

export default VegaChart;
