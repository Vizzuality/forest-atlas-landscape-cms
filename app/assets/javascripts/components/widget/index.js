import React from 'react';
import VegaChart from '../vega-chart';

class Widget extends React.Component {

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    const chart = this.props.widget.data
      ? <VegaChart
        data={this.props.widget}
        width={220}
        height={200}
      />
      : <div>Loading</div>;

    return (
      <div ref="widget" className="c-widget">
        <div className="name">
          {this.props.name}
        </div>
        <div className="chart">
          {chart}
        </div>
      </div>
    );
  }
}

Widget.propTypes = {
  slug: React.PropTypes.string,
  name: React.PropTypes.string,
  widget: React.PropTypes.object
};

export default Widget;
