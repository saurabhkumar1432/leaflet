import React from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';

const Map = () => {
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    alert(`Clicked at: ${lat}, ${lng}`);
  };

  return (
    <MapContainer center={[13.0827, 80.2707]} zoom={13} style={{ height: '500px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEventsHandler handleMapClick={handleMapClick} />
    </MapContainer>
  );
};

const MapEventsHandler = ({ handleMapClick }) => {
  useMapEvents({
    click: (e) => handleMapClick(e),
  });
  return null;
};

export default Map;