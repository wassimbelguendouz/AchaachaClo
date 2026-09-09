import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Edit3, Users, X, Check } from 'lucide-react';

export const ManualSeatModal = ({ isOpen, onClose }) => {
  const { t, user, updateDriverSeats } = useApp();
  const [seats, setSeats] = useState(user?.nbdisponibilite ?? 3);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateDriverSeats(seats);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '420px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit3 size={20} />
              {t.manualSeatsTitle}
            </h3>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ width: '32px', height: '32px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} />
            </button>
          </div>

          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '20px' }}>
            {t.manualSeatsSubtitle}
          </p>

          <div style={{ margin: '16px 0' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#fbbf24', marginBottom: '8px' }}>
              {t.availableSeats} (`nbdisponibilite`)
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ width: '44px', height: '44px', fontSize: '1.4rem', fontWeight: 800 }}
                onClick={() => setSeats(prev => Math.max(0, parseInt(prev || 0) - 1))}
              >
                -
              </button>

              <input
                type="number"
                min="0"
                max="8"
                className="input-field"
                value={seats}
                onChange={(e) => setSeats(Math.max(0, parseInt(e.target.value) || 0))}
                style={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: 800, padding: '8px' }}
              />

              <button
                type="button"
                className="btn-secondary"
                style={{ width: '44px', height: '44px', fontSize: '1.4rem', fontWeight: 800 }}
                onClick={() => setSeats(prev => Math.min(8, parseInt(prev || 0) + 1))}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>
              {t.cancel}
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }}>
              <Check size={18} />
              {t.saveSeats}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
