import React from 'react';
import MapView from '../views/MapView';
import { connect } from 'react-redux';
import { createLayer, CREATE_LAYER } from '../actions/map';

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tilesList: {}
    };
  }

  componentDidMount() {
    this.props.createLayer({
      type: CREATE_LAYER,
      layer: {
        slug: 'world_borders',
        layer: {
          sql: 'SELECT * FROM world_borders',
          cartocss: '#null{polygon-fill: #FF6600;polygon-opacity: 0.5;}',
        }
      }
    });
  }

  componentWillReceiveProps(props) {
    this.addLayer(props.layer);
  }

  addLayer(layer) {
    if (!this.state.tilesList[layer.slug]) {
      const newList = Object.assign({}, this.state.tilesList);
      newList[layer.slug] = layer.tile;

      this.setState({
        tilesList: newList
      });
    }
  }

  render() {
    return (
      <MapView
        tiles={this.state.tilesList}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    layer: state.map.layer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createLayer: (action) => {
      dispatch(createLayer(action));
    }
  };
}

MapContainer.propTypes = {
  createLayer: React.PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);
