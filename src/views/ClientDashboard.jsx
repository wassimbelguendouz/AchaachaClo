import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapView } from '../components/MapView';
import { BackButton } from '../components/BackButton';
import { Search, MapPin, Navigation, Car, Phone, Users, CheckCircle, Clock, XCircle, MessageSquare, AlertTriangle, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ClientDashboard = () => {
  const {
    t,
    user,
    transporteurs,
    rideRequests,
    bookRideDiniM3ak,
    cancelRide,
    setActiveChatReq,
    setCurrentView,
    getUnreadMessageCount,
    firebaseActive
  } = useApp();

  const [source, setSource] = useState('Achaacha Centre');
  const [destination, setDestination] = useState('Mostaganem Ville');
  const [departureTime, setDepartureTime] = useState('08:30');
  const [hasSearched, setHasSearched] = useState(false);

  // Selected driver modal for diniM3ak seat count picker
  const [selectedDriverModal, setSelectedDriverModal] = useState(null);
  const [chosenSeats, setChosenSeats] = useState(1);

  // Filter transporteurs:
  // RULE: If nbdisponibilite === 0, DO NOT DISPLAY!
  const availableDriversList = transporteurs.filter(driver => {
    return (driver.nbdisponibilite || 0) > 0;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const handleOpenDiniM3akModal = (driver) => {
    setSelectedDriverModal(driver);
    setChosenSeats(1);
  };

  const handleConfirmBooking = () => {
    if (!selectedDriverModal) return;
    const req = bookRideDiniM3ak(
      selectedDriverModal,
      chosenSeats,
      source,
      destination,
      departureTime,
      { lat: 36.242, lng: 0.285 },
      { lat: 35.933, lng: 0.089 }
    );

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    setSelectedDriverModal(null);
  };

  // Find active ride for this client
  const myRequests = rideRequests.filter(r => r.clientId === user?.id || r.clientPhone === user?.phone);
  const activeRide = myRequests.find(r => r.status === 'pending' || r.status === 'accepted');

  const handleCancelRide = (reqId) => {
    if (window.confirm(t.cancelConfirm)) {
      cancelRide(reqId);
    }
  };

  const activeUnread = activeRide ? getUnreadMessageCount(activeRide.id) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header Controls with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <BackButton onClick={() => setCurrentView('account_select')} label={t.switchAccountBtn} />
      </div>

      {/* Search Bar, Destination & Departure Hour Setup */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation size={22} />
          {t.searchTitle}
        </h2>

        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#10b981', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} /> {t.sourceLabel}
            </label>
            <input
              type="text"
              className="input-field"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder={t.sourcePlaceholder}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ef4444', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📍 {t.destLabel}
            </label>
            <input
              type="text"
              className="input-field"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={t.destPlaceholder}
              required
            />
          </div>

          {/* Departure Hour Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#fbbf24', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} /> {t.departureTimeLabel}
            </label>
            <input
              type="time"
              className="input-field"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              required
              style={{ fontWeight: 700 }}
            />
          </div>

          <div>
            <button type="submit" className="btn-primary" style={{ width: '100%', height: '48px', fontSize: '1rem' }}>
              <Search size={18} />
              {t.searchBtn}
            </button>
          </div>
        </form>
      </div>

      {/* Active Ride Banner with Departure Time & Driver Decision Status Line */}
      {activeRide && (
        <div className="glass-panel" style={{ padding: '20px', border: activeRide.status === 'accepted' ? '1px solid #10b981' : '1px solid #f59e0b', background: activeRide.status === 'accepted' ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className={`badge-status ${activeRide.status === 'accepted' ? 'badge-accepted' : 'badge-pending'}`}>
                  {activeRide.status === 'accepted' ? t.statusAccepted : t.statusPending}
                </span>
                
                {/* Client Departure Time Badge */}
                <span style={{ padding: '4px 10px', background: 'rgba(245,158,11,0.2)', border: '1px solid #f59e0b', borderRadius: '12px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> {t.departureTimeBadge} <strong>{activeRide.departureTime || '08:30'}</strong>
                </span>

                {/* Driver Proposed Departure Time Badge */}
                {activeRide.driverDepartureTime && (
                  <span style={{ padding: '4px 10px', background: 'rgba(6,182,212,0.2)', border: '1px solid #06b6d4', borderRadius: '12px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    🚘 {t.driverTimeBadge} <strong>{activeRide.driverDepartureTime}</strong>
                  </span>
                )}

                {/* Final Agreed Time Badge */}
                {activeRide.finalAgreedTime && (
                  <span style={{ padding: '4px 10px', background: 'rgba(16,185,129,0.25)', border: '1px solid #10b981', borderRadius: '12px', color: '#34d399', fontSize: '0.85rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    ⏰ {t.finalAgreedTimeLabel} <strong>{activeRide.finalAgreedTime}</strong>
                  </span>
                )}

                <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{new Date(activeRide.createdAt).toLocaleTimeString()}</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '10px', color: '#fff' }}>
                {activeRide.driverPrenom} {activeRide.driverNom} ({activeRide.carModel})
              </h3>
              <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#d1d5db' }}>
                {t.sourceLabel}: <strong>{activeRide.source}</strong> ➔ {t.destLabel}: <strong>{activeRide.destination}</strong>
              </p>

              {/* Explicit Driver Decision Line */}
              <div style={{ marginTop: '8px', padding: '8px 12px', background: activeRide.status === 'accepted' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, color: activeRide.status === 'accepted' ? '#34d399' : '#fbbf24', border: '1px solid rgba(255,255,255,0.1)' }}>
                <strong>{t.driverDecisionLabel}</strong> {activeRide.driverDecisionText || (activeRide.status === 'accepted' ? t.decisionAccepted : t.decisionPending)}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: '#fbbf24' }}><strong>{activeRide.requestedSeats}</strong> {t.requestedSeatsCount}</span>
                {activeRide.status === 'accepted' && (
                  <span style={{ color: '#34d399', fontWeight: 700 }}>
                    {t.unitPriceLabel} {activeRide.unitPrice} DZD ({t.totalPriceLabel} {activeRide.totalPrice} DZD)
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {/* Chat Button with Red Unread Badge */}
              <button onClick={() => setActiveChatReq(activeRide)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
                <MessageSquare size={16} color="#38bdf8" />
                {t.messages}
                {activeUnread > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.6)',
                    border: '2px solid #0b0f19'
                  }}>
                    {activeUnread}
                  </span>
                )}
              </button>

              <a href={`tel:${activeRide.driverPhone}`} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', textDecoration: 'none' }}>
                <Phone size={16} />
                {activeRide.driverPhone}
              </a>

              <button onClick={() => handleCancelRide(activeRide.id)} className="btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <XCircle size={16} />
                {t.cancelRideBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Available Drivers List */}
      {hasSearched && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          {!firebaseActive && (
            <div style={{
              marginBottom: '16px',
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#fbbf24',
              fontWeight: 700,
              fontSize: '0.82rem'
            }}>
              La recherche entre appareils exige Firebase. Sans VITE_FIREBASE_* configuré, chaque téléphone garde ses propres données locales et aucun chauffeur ne peut apparaître à distance.
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car size={22} color="#f59e0b" />
              {t.availableDrivers} ({availableDriversList.length})
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              (Chauffeurs avec 0 place disponible sont masqués)
            </span>
          </div>

          {availableDriversList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: '#9ca3af' }}>
              <AlertTriangle size={44} color="#f59e0b" style={{ margin: '0 auto 12px auto', opacity: 0.8 }} />
              <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>{t.noDriversFound}</p>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '6px' }}>
                {t.pleaseRegisterDriverNotice}
              </p>
              <button
                onClick={() => setCurrentView('onboarding')}
                className="btn-primary"
                style={{ marginTop: '16px', padding: '10px 20px', fontSize: '0.9rem' }}
              >
                ➕ Créer un compte Transporteur maintenant
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {availableDriversList.map((driver) => (
                <div key={driver.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                          {driver.prenom} {driver.nom}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: '#38bdf8', margin: '2px 0 0 0', fontWeight: 600 }}>
                          🚗 {driver.carModel}
                        </p>
                      </div>

                      {/* Available Seats Badge */}
                      <div className="badge-seats" style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
                        <Users size={14} />
                        <strong>{driver.nbdisponibilite}</strong> {t.seatsLeft}
                      </div>
                    </div>

                    <div style={{ margin: '14px 0 0 0', fontSize: '0.85rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} color="#10b981" />
                      <a href={`tel:${driver.phone}`} style={{ color: '#34d399', fontWeight: 600, textDecoration: 'underline' }}>
                        {driver.phone}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleOpenDiniM3akModal(driver)}
                      className="btn-dinim3ak"
                      style={{ width: '100%', padding: '12px', fontSize: '1.05rem' }}
                    >
                      diniM3ak 🚗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* diniM3ak Seat Selection Modal */}
      {selectedDriverModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ background: '#f59e0b', width: '50px', height: '50px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#000', marginBottom: '10px' }}>
                <Car size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                diniM3ak avec {selectedDriverModal.prenom} {selectedDriverModal.nom}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '4px' }}>
                {t.departureTimeBadge} <strong>{departureTime}</strong>
              </p>
            </div>

            <div style={{ margin: '20px 0' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#fbbf24', marginBottom: '8px' }}>
                {t.selectSeatsTitle}
              </label>
              
              {/* Dropdown list from 1 to driver.nbdisponibilite */}
              <select
                className="input-field"
                value={chosenSeats}
                onChange={(e) => setChosenSeats(parseInt(e.target.value))}
                style={{ fontSize: '1.1rem', fontWeight: 700, padding: '12px', height: 'auto' }}
              >
                {Array.from({ length: selectedDriverModal.nbdisponibilite }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num} style={{ background: '#0b0f19', color: '#fff' }}>
                    {num} place{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>

              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#9ca3af', textAlign: 'right' }}>
                {t.maxAvailableNotice} <strong>{selectedDriverModal.nbdisponibilite}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setSelectedDriverModal(null)}
                className="btn-secondary"
                style={{ flex: 1, padding: '12px' }}
              >
                <BackButton label={t.cancel} onClick={() => setSelectedDriverModal(null)} />
              </button>
              <button
                onClick={handleConfirmBooking}
                className="btn-dinim3ak"
                style={{ flex: 1, padding: '12px' }}
              >
                {t.confirmBooking}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
