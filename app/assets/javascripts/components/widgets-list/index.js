import React from 'react';

class WidgetsList extends React.Component {

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    return (
      <div ref="widgets-list" className="c-widgets-list">
        <ul>
          {this.props.data.map((item, key) => {
            return <li key={key}>{item.name}</li>;
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
