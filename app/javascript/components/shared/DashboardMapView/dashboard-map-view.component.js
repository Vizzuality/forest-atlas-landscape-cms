import React from 'react';
import PropTypes from 'prop-types';

class DashboardMapView extends React.Component {
  componentDidMount() {
    if (this.mapEl) {
      this.createMap();
      if (this.props.layerUrl) this.addGeometryLayer();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.layerUrl !== this.props.layerUrl) {
      if (!this.props.layerUrl) {
        this.removeGeometryLayer();
      } else {
        this.addGeometryLayer();
      }
    } else if (prevProps.sqlWhere !== this.props.sqlWhere) {
      this.updateQuery();
    }
  }

  /**
   * Create the map
   */
  createMap() {
    this.map = L.map(this.mapEl).setView([0, 0], 3);

    // We add the base layer
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);
  }

  /**
   * Add the geometry layer to the map
   */
  addGeometryLayer() {
    if (this.geometryLayer) this.removeGeometryLayer();

    this.geometryLayer = L.esri.featureLayer({ url: this.props.layerUrl });
    this.geometryLayer.addTo(this.map);

    // We filter the geometris
    this.updateQuery();

    // We zoom on the geometries
    this.geometryLayer.once('load', () => {
      const bounds = L.latLngBounds([]);

      this.geometryLayer.eachFeature((layer) => {
        const layerBounds = layer.getBounds();
        bounds.extend(layerBounds);
      });

      this.map.fitBounds(bounds);
    });
  }

  /**
   * Remove the geometry layer from the map
   */
  removeGeometryLayer() {
    this.map.removeLayer(this.geometryLayer);
    this.geometryLayer = null;
  }

  /**
   * Update the WHERE SQL query that is passed to the layer
   */
  updateQuery() {
    if (this.geometryLayer) {
      this.geometryLayer.setWhere(this.props.sqlWhere);
    }
  }

  render() {
    return (
      <div className="c-dashboard-map-view">
        <div className="map" ref={(el) => { this.mapEl = el; }} />
      </div>
    );
  }
}

DashboardMapView.propTypes = {
  layerUrl: PropTypes.string,
  sqlWhere: PropTypes.string
};

DashboardMapView.defaultProps = {
  layerUrl: null,
  sqlWhere: null
};

export default DashboardMapView;
