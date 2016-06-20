import React from 'react';

class Widget extends React.Component {

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    return (
      <div ref="widget" className="c-widget"></div>
    );
  }
}

Widget.propTypes = {
  slug: React.PropTypes.string.isRequired
};

export default Widget;
