import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/BackButton';
import { Users, CheckCircle, Bell, Phone, MapPin, Navigation, Edit3, MessageSquare, DollarSign, Car, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TransporteurDashboard = ({ onOpenManualSeats }) => {
  const {
    t,
    user,
    rideRequests,
    acceptRideOkRakM3aya,
    setActiveChatReq,
    setRouteSchemaReq,
    setCurrentView,
    getUnreadMessageCount
  } = useApp();

  // Accept Ride Modal state (for okRakM3aya + unit price input + driver departure time proposal)
  const [acceptingReqModal, setAcceptingReqModal] = useState(null);
  const [unitPriceInput, setUnitPriceInput] = useState('500');
  const [driverTimeInput, setDriverTimeInput] = useState('08:45');

  // Filter requests for current driver (or all driver requests if testing)
  const driverRequests = rideRequests.filter(r => r.driverId === user?.id || r.driverPhone === user?.phone || !user?.id);
  const pendingRequests = driverRequests.filter(r => r.status === 'pending');
  const acceptedRequests = driverRequests.filter(r => r.status === 'accepted');

  const handleOpenAcceptModal = (req) => {
    setAcceptingReqModal(req);
    setUnitPriceInput('500'); // Default price suggestion
    setDriverTimeInput(req.departureTime || '08:45'); // Propose driver time
  };

  const handleConfirmOkRakM3aya = (e) => {
    e.preventDefault();
    if (!acceptingReqModal) return;
    if (!unitPriceInput || parseFloat(unitPriceInput) <= 0) {
      alert("Veuillez saisir un prix unitaire valide.");
      return;
    }

    acceptRideOkRakM3aya(acceptingReqModal.id, unitPriceInput, driverTimeInput);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setAcceptingReqModal(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header Controls with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <BackButton onClick={() => setCurrentView('account_select')} label={t.switchAccountBtn} />
      </div>

      {/* Top Banner & Quick Seat Adjustment */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Car size={24} />
            {t.driverDashboardTitle}
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            {user?.carModel} | {user?.prenom} {user?.nom} ({user?.phone})
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div className="badge-seats" style={{ padding: '8px 16px', fontSize: '1rem' }}>
            <Users size={18} />
            <span>{t.availableSeats}:</span>
            <strong style={{ fontSize: '1.2rem', color: '#fff', marginLeft: '4px' }}>
              {user?.nbdisponibilite ?? 0}
            </strong>
          </div>

          <button onClick={onOpenManualSeats} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Edit3 size={16} color="#fbbf24" />
            {t.editSeats}
          </button>
        </div>
      </div>

      {/* Pending Incoming Requests Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(245,158,11,0.2)', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
            <Bell size={20} className={pendingRequests.length > 0 ? "animate-pulse" : ""} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            {t.incomingRequests} ({pendingRequests.length})
          </h3>
        </div>

        {pendingRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: '#9ca3af' }}>
            <p style={{ fontSize: '0.95rem' }}>{t.noRequests}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
            {pendingRequests.map((req) => {
              const unread = getUnreadMessageCount(req.id);
              return (
                <div key={req.id} className="glass-card animate-pulse-glow" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                          {req.clientPrenom} {req.clientNom}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: '#34d399', margin: '2px 0 0 0', fontWeight: 600 }}>
                          <Phone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                          <a href={`tel:${req.clientPhone}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{req.clientPhone}</a>
                        </div>
                      </div>

                      <div className="badge-seats" style={{ fontSize: '0.9rem' }}>
                        <strong>{req.requestedSeats}</strong> {t.seatsLeft}
                      </div>
                    </div>

                    {/* Departure Times comparison badges */}
                    <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(245,158,11,0.15)', borderRadius: '8px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} /> {t.departureTimeBadge} <strong>{req.departureTime || '08:30'}</strong>
                      </div>
                      {req.driverDepartureTime && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
                          🚘 {t.driverTimeBadge} <strong>{req.driverDepartureTime}</strong>
                        </div>
                      )}
                    </div>

                    {/* Driver Decision Line */}
                    <div style={{ marginTop: '6px', padding: '6px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700 }}>
                      <strong>{t.driverDecisionLabel}</strong> {req.driverDecisionText || t.decisionPending}
                    </div>

                    <div style={{ marginTop: '10px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem' }}>
                      <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} /> Source: <strong>{req.source}</strong>
                      </div>
                      <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        📍 Destination: <strong>{req.destination}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {/* Chat button with Red Unread Notification Badge */}
                    <button
                      onClick={() => setActiveChatReq(req)}
                      className="btn-secondary"
                      style={{ padding: '10px', position: 'relative' }}
                      title={t.messages}
                    >
                      <MessageSquare size={16} color="#38bdf8" />
                      {unread > 0 && (
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
                          {unread}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleOpenAcceptModal(req)}
                      className="btn-okrakm3aya"
                      style={{ flex: 1, padding: '12px', fontSize: '1rem' }}
                    >
                      {t.acceptBtn}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmed / Accepted Clients Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <CheckCircle size={22} color="#10b981" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            {t.acceptedClientsList} ({acceptedRequests.length})
          </h3>
        </div>

        {acceptedRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: '#9ca3af' }}>
            <p style={{ fontSize: '0.95rem' }}>{t.noAcceptedClients}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
            {acceptedRequests.map((req) => {
              const unread = getUnreadMessageCount(req.id);
              return (
                <div key={req.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                          {req.clientPrenom} {req.clientNom}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: '#34d399', margin: '2px 0 0 0', fontWeight: 600 }}>
                          <Phone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                          <a href={`tel:${req.clientPhone}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{req.clientPhone}</a>
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span className="badge-status badge-accepted" style={{ fontSize: '0.75rem' }}>
                          {t.statusAccepted}
                        </span>
                        <div style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: 700, marginTop: '4px' }}>
                          {req.requestedSeats} places ({req.totalPrice} DZD)
                        </div>
                      </div>
                    </div>

                    {/* Departure Time comparison banner */}
                    <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(16,185,129,0.15)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} /> {t.departureTimeBadge} <strong>{req.departureTime || '08:30'}</strong>
                      </div>
                      <div style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        🚘 {t.driverTimeBadge} <strong>{req.driverDepartureTime || '08:45'}</strong>
                      </div>
                      {req.finalAgreedTime && (
                        <div style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '4px' }}>
                          ⏰ {t.finalAgreedTimeLabel} <strong>{req.finalAgreedTime}</strong>
                        </div>
                      )}
                    </div>

                    {/* Driver Decision Line */}
                    <div style={{ marginTop: '6px', padding: '6px 10px', background: 'rgba(16,185,129,0.2)', borderRadius: '8px', fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>
                      <strong>{t.driverDecisionLabel}</strong> {req.driverDecisionText || t.decisionAccepted}
                    </div>

                    <div style={{ marginTop: '10px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem' }}>
                      <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} /> <strong>{req.source}</strong>
                      </div>
                      <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        📍 <strong>{req.destination}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setRouteSchemaReq(req)}
                      className="btn-primary"
                      style={{ flex: 1, padding: '10px', fontSize: '0.9rem' }}
                    >
                      <Navigation size={16} />
                      {t.seeSchemaOnMap}
                    </button>

                    {/* Chat button with Red Unread Notification Badge */}
                    <button
                      onClick={() => setActiveChatReq(req)}
                      className="btn-secondary"
                      style={{ padding: '10px', position: 'relative' }}
                      title={t.messages}
                    >
                      <MessageSquare size={16} color="#38bdf8" />
                      {unread > 0 && (
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
                          {unread}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* okRakM3aya Price & Departure Time Proposal Input Modal */}
      {acceptingReqModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <form onSubmit={handleConfirmOkRakM3aya}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ background: '#10b981', width: '50px', height: '50px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '10px' }}>
                  <CheckCircle size={30} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  {t.enterUnitPriceTitle}
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '4px' }}>
                  Client: <strong>{acceptingReqModal.clientPrenom} {acceptingReqModal.clientNom}</strong> ({acceptingReqModal.requestedSeats} places - Heure client: {acceptingReqModal.departureTime})
                </p>
              </div>

              <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#34d399', marginBottom: '8px' }}>
                    {t.unitPriceInputLabel} *
                  </label>
                  
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min="1"
                      className="input-field"
                      placeholder="Ex: 500"
                      value={unitPriceInput}
                      onChange={(e) => setUnitPriceInput(e.target.value)}
                      required
                      autoFocus
                      style={{ fontSize: '1.2rem', fontWeight: 700, paddingLeft: '40px' }}
                    />
                    <DollarSign size={20} color="#10b981" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* REQUIREMENT 3: Driver proposed departure time input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8', marginBottom: '6px' }}>
                    {t.driverTimeInputLabel} *
                  </label>
                  <input
                    type="time"
                    className="input-field"
                    value={driverTimeInput}
                    onChange={(e) => setDriverTimeInput(e.target.value)}
                    required
                    style={{ fontWeight: 700 }}
                  />
                </div>

                <div style={{ fontSize: '0.85rem', color: '#9ca3af', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                  💡 Prix total calculé : <strong>{(parseFloat(unitPriceInput) || 0) * (parseInt(acceptingReqModal.requestedSeats) || 1)} DZD</strong><br/>
                  Le nombre de places disponibles sera décrémenté automatiquement.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setAcceptingReqModal(null)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="btn-okrakm3aya"
                  style={{ flex: 1, padding: '12px' }}
                >
                  {t.confirmAccept}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
