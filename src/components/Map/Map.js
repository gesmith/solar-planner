import React, { useRef, useEffect, useState } from 'react';
import propTypes from 'prop-types';
import './Map.css';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoiZ3NjcmlwdCIsImEiOiJjbDdnN2Z0cGUwMXNmM25vZnJnbHBmYXY1In0.webVjZGyliDaSaf7ZEAI9Q';

export default function Map({ onDraw }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-72.7592149);
  const [lat, setLat] = useState(44.8179668);
  const [zoom, setZoom] = useState(18);

  const draw = new MapboxDraw({
    displayControlsDefault: false,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
      polygon: true,
      trash: true
    }
  });

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
    // Add the control to the map.
    map.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
    );

    map.current.addControl(draw, 'top-left');

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
    map.current.on('draw.create', onDraw);
    map.current.on('draw.delete', onDraw);
    map.current.on('draw.update', onDraw);
  });

  return <div ref={mapContainer} className="map-container" />;
}

Map.propTypes = {
  onDraw: propTypes.func
};
