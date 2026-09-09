import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Car, PlusCircle, Trash2, ShieldCheck, Phone, ArrowRight } from 'lucide-react';

export const AccountSelector = ({ onSelectAccount, onCreateNewAccount, onEditAccount, onDeleteAccount, onClearDb }) => {
  const { t, accounts } = useApp();

  return (
    <div style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel" style={{ maxWidth: '580px', width: '100%', padding: '36px', borderRadius: '24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #06b6d4, #f59e0b)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '12px',
            boxShadow: '0 8px 25px rgba(6, 182, 212, 0.4)'
          }}>
            <User size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#fff' }}>
            {t.selectAccountTitle}
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '6px' }}>
            {t.selectAccountSubtitle}
          </p>
        </div>

        {/* Existing Accounts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          {accounts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', color: '#9ca3af', fontSize: '0.9rem' }}>
              <p>{t.noAccountsYet}</p>
            </div>
          ) : (
            accounts.map((acc) => (
              <div
                key={acc.id}
                className="glass-card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  border: acc.role === 'transporteur' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div onClick={() => onSelectAccount(acc)} style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, cursor: 'pointer' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: acc.role === 'transporteur' ? 'linear-gradient(135deg, #f59e0b, #10b981)' : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}>
                    {acc.role === 'transporteur' ? <Car size={22} /> : <User size={22} />}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {acc.prenom} {acc.nom}
                      <span className={`badge-status ${acc.role === 'transporteur' ? 'badge-pending' : 'badge-accepted'}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                        {acc.role === 'transporteur' ? t.driverRole : t.clientRole}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span><Phone size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {acc.phone}</span>
                      {acc.carModel && <span>🚗 {acc.carModel} ({acc.nbdisponibilite ?? acc.initialSeats ?? 0} places libres)</span>}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAccount(acc);
                    }}
                    style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAccount(acc);
                    }}
                    style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={onCreateNewAccount}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', borderRadius: '14px', fontSize: '1rem' }}
          >
            <PlusCircle size={18} />
            {t.createNewAccount}
          </button>

          <button
            onClick={onClearDb}
            className="btn-danger"
            style={{ width: '100%', padding: '10px', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Trash2 size={16} />
            {t.emptyDbBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
