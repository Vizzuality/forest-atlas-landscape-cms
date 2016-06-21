import React from 'react';
import Widget from '../widget';

class WidgetsList extends React.Component {

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    return (
      <div ref="widgets-list" className="c-widgets-list">
        <ul className="list">
          {this.props.data.map((item, key) => {
            const data = item.data ? item.data.chart : {};
            return (
              <li className="item" key={key}>
                <Widget name={item.name} widget={data} />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

WidgetsList.propTypes = {
  data: React.PropTypes.array.isRequired,
};

export default WidgetsList;
