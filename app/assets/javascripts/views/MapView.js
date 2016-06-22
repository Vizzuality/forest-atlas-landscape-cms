import React from 'react';
import Header from '../components/header';
import Map from '../components/map';

class MapView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="wrapper">
        <Header />
        <div className="l-content">
          <Map tiles={this.props.tiles} />
        </div>
      </div>
    );
  }

}

export default MapView;
