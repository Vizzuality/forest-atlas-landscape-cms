import React from 'react';
const BASEMAP = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.activeTiles = {};
  }

  componentDidMount() {
    this.initMap();
  }

  componentWillReceiveProps(props) {
    this.updateTiles(props.tiles);
  }

  initMap() {
    this.map = L.map(this.refs.map, {
      center: [39.950490, -98.746077],
      zoom: 3
    });
    this.basemap = L.tileLayer(BASEMAP);
    this.basemap.addTo(this.map);
  }

  updateTiles(tiles) {
    if (tiles) {
      Object.keys(tiles).forEach((slug) => {
        if (!this.activeTiles[slug]) {
          this.activeTiles[slug] = {
            tile: tiles[slug],
            layer: {}
          };
          this.addTile(slug, tiles[slug]);
        }
      });

      this.checkRemovedTiles(tiles);
    }
  }

  checkRemovedTiles(tiles) {
    const currentTiles = new Set(Object.keys(this.activeTiles));
    const newTiles = new Set(Object.keys(tiles));
    const difference = new Set(
      [...currentTiles].filter(x => !newTiles.has(x)));

    if (difference.size) {
      this.removeTiles(difference);
    }
  }

  removeTiles(tiles) {
    const currentList = Object.assign({}, this.activeTiles);
    const newList = {};

    Object.keys(currentList).forEach((slug) => {
      if (!tiles.has(slug)) {
        newList[slug] = currentList[slug];
      } else {
        this.map.removeLayer(this.activeTiles[slug].layer);
      }
    });

    this.activeTiles = newList;
  }

  addTile(slug, tile) {
    const layer = L.tileLayer(tile, { noWrap: true });
    layer.addTo(this.map);
    this.activeTiles[slug].layer = layer;
  }

  render() {
    return (
      <div ref="map" className="c-map" id="map"></div>
    );
  }
}

export default Map;
