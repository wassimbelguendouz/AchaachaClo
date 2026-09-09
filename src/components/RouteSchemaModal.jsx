import React from 'react';
import { useApp } from '../context/AppContext';
import { MapView } from './MapView';
import { X, Navigation, Phone, User, Car, MapPin, DollarSign } from 'lucide-react';

export const RouteSchemaModal = () => {
  const { t, routeSchemaReq, setRouteSchemaReq } = useApp();

  if (!routeSchemaReq) return null;

  const {
    clientNom,
    clientPrenom,
    clientPhone,
    source,
    destination,
    requestedSeats,
    unitPrice,
    totalPrice,
    sourceCoords,
    destCoords,
    driverCoords
  } = routeSchemaReq;

  // Open external Google Maps direction URL as a feature
  const openGoogleMapsExternal = () => {
    const originStr = sourceCoords ? `${sourceCoords.lat},${sourceCoords.lng}` : encodeURIComponent(source);
    const destStr = destCoords ? `${destCoords.lat},${destCoords.lng}` : encodeURIComponent(destination);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destStr}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px', width: '95%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={22} />
              {t.schemaTitle}
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              {t.passengerInfo} : <strong>{clientPrenom} {clientNom}</strong>
            </p>
          </div>
          <button
            onClick={() => setRouteSchemaReq(null)}
            className="btn-secondary"
            style={{ borderRadius: '50%', width: '38px', height: '38px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Passenger Summary Banner */}
        <div className="glass-card" style={{ padding: '16px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{t.passengerInfo}</span>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} color="#38bdf8" />
              {clientPrenom} {clientNom}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <Phone size={14} />
              <a href={`tel:${clientPhone}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{clientPhone}</a>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{t.requestedSeatsCount} & Prix</span>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fbbf24' }}>
              {requestedSeats} {t.seatsLeft}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#38bdf8', marginTop: '4px' }}>
              {unitPrice ? `${unitPrice} DZD / place (${totalPrice} DZD total)` : 'Prix à fixer'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Trajet</span>
            <div style={{ fontSize: '0.85rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} color="#10b981" /> <strong>{source}</strong>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              🏁 <strong>{destination}</strong>
            </div>
          </div>
        </div>

        {/* Map Interactive Schema */}
        <div style={{ height: '360px', marginBottom: '20px' }}>
          <MapView
            driverCoords={driverCoords}
            sourceCoords={sourceCoords}
            destCoords={destCoords}
          />
        </div>

        {/* Legend & Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', itemsCenter: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🚘 {t.driverPos}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📍 {t.pickupPos}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🏁 {t.destPos}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={openGoogleMapsExternal} className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
              <Navigation size={16} />
              Ouvrir sur Google Maps
            </button>
            <button onClick={() => setRouteSchemaReq(null)} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
              {t.closeMap}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
