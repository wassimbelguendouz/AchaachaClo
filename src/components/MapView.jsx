import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leafet marker icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Pins
const createCustomIcon = (color, emoji) => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div style="
        background: ${color};
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        border: 2px solid white;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
};

export const MapView = ({ driverCoords, sourceCoords, destCoords, interactive = false, onSelectLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter = sourceCoords || driverCoords || { lat: 36.242, lng: 0.285 };
      const map = L.map(mapRef.current, {
        center: [defaultCenter.lat, defaultCenter.lng],
        zoom: 12,
        zoomControl: true
      });

      // Google Maps style tile layer (CartoDB Dark / Voyager or OSM)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; Google Maps / OpenStreetMap & CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      if (interactive && onSelectLocation) {
        map.on('click', (e) => {
          onSelectLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        });
      }
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const points = [];

    // Driver Marker
    if (driverCoords && driverCoords.lat) {
      const marker = L.marker([driverCoords.lat, driverCoords.lng], {
        icon: createCustomIcon('#f59e0b', '🚘')
      }).bindPopup('<b>Chauffeur / Transporteur</b>');
      layerGroup.addLayer(marker);
      points.push([driverCoords.lat, driverCoords.lng]);
    }

    // Source Pickup Marker
    if (sourceCoords && sourceCoords.lat) {
      const marker = L.marker([sourceCoords.lat, sourceCoords.lng], {
        icon: createCustomIcon('#10b981', '📍')
      }).bindPopup('<b>Point de Départ (Client)</b>');
      layerGroup.addLayer(marker);
      points.push([sourceCoords.lat, sourceCoords.lng]);
    }

    // Destination Marker
    if (destCoords && destCoords.lat) {
      const marker = L.marker([destCoords.lat, destCoords.lng], {
        icon: createCustomIcon('#ef4444', '🏁')
      }).bindPopup('<b>Destination Final</b>');
      layerGroup.addLayer(marker);
      points.push([destCoords.lat, destCoords.lng]);
    }

    // Draw polyline connecting route
    if (points.length >= 2) {
      const polyline = L.polyline(points, {
        color: '#38bdf8',
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 10',
        lineCap: 'round'
      });
      layerGroup.addLayer(polyline);
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    } else if (points.length === 1) {
      map.setView(points[0], 13);
    }

  }, [driverCoords, sourceCoords, destCoords, interactive]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '320px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
