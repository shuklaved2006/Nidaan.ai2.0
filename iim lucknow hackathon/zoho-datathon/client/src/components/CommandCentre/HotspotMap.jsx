import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapController = () => {
  const map = useMap();

  useEffect(() => {
    const handleZoom = () => {
      // Ashok Nagar coordinates
      map.flyTo([12.9719, 77.6066], 15, {
        duration: 2
      });
    };
    const handleReset = () => {
      map.flyTo([12.9716, 77.5946], 12, { duration: 1 });
    };
    window.addEventListener('demo:hotspot-ashok-nagar', handleZoom);
    window.addEventListener('demo:reset', handleReset);
    return () => {
      window.removeEventListener('demo:hotspot-ashok-nagar', handleZoom);
      window.removeEventListener('demo:reset', handleReset);
    };
  }, [map]);

  return null;
};

const HotspotMap = () => {
  // Coordinates for Bangalore/Karnataka region
  const position = [12.9716, 77.5946];
  
  return (
    <MapContainer center={position} zoom={12} style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-sm)' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <MapController />
      <Marker position={[12.9716, 77.5946]}>
        <Popup>High crime frequency zone</Popup>
      </Marker>
      <Marker position={[12.9719, 77.6066]}>
        <Popup>Ashok Nagar Hotspot</Popup>
      </Marker>
      <Marker position={[12.9352, 77.6245]}>
        <Popup>Recent theft reported</Popup>
      </Marker>
    </MapContainer>
  );
};

export default HotspotMap;
