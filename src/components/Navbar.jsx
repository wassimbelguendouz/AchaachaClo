import React from 'react';
import { useApp } from '../context/AppContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { BackButton } from './BackButton';
import { Car, User, Phone, Edit3, Users, MessageSquare } from 'lucide-react';

export const Navbar = ({ onOpenManualSeats }) => {
  const { t, user, activeRole, setActiveRole, setCurrentView, accounts, getTotalUnreadCount, refreshLocalData } = useApp();
  const totalUnread = getTotalUnreadCount();

  return (
    <header className="glass-panel mb-6 px-6 py-4 flex flex-wrap items-center justify-between gap-4" style={{ padding: '16px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f59e0b, #3b82f6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
        }}>
          <Car size={26} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(to right, #f59e0b, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            {t.appName}
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>
            {t.tagline}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        
        {/* Account Switcher Button */}
        {accounts.length > 0 && (
          <button
            onClick={() => setCurrentView('account_select')}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '6px 12px', borderRadius: '10px' }}
            title={t.switchAccountBtn}
          >
            👥 {t.switchAccountBtn}
          </button>
        )}

        {/* Role Toggle Switch */}
        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '4px', display: 'flex', gap: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => setActiveRole('client')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              background: activeRole === 'client' ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' : 'transparent',
              color: activeRole === 'client' ? '#fff' : '#9ca3af',
              transition: 'all 0.2s'
            }}
          >
            👤 {t.clientRole}
          </button>
          <button
            onClick={() => setActiveRole('transporteur')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              background: activeRole === 'transporteur' ? 'linear-gradient(135deg, #f59e0b, #10b981)' : 'transparent',
              color: activeRole === 'transporteur' ? '#fff' : '#9ca3af',
              transition: 'all 0.2s'
            }}
          >
            🚘 {t.driverRole}
          </button>
        </div>

        {/* Global Red Unread Message Notification Badge */}
        {totalUnread > 0 && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            color: '#f87171',
            borderRadius: '12px',
            padding: '4px 10px',
            fontSize: '0.8rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              background: '#ef4444',
              color: '#fff',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem'
            }}>
              {totalUnread}
            </span>
            <span>{t.messages} non lus</span>
          </div>
        )}

        {/* Transporteur Available Seats Quick Widget */}
        {activeRole === 'transporteur' && user && (
          <button
            onClick={onOpenManualSeats}
            className="badge-seats"
            style={{ cursor: 'pointer', border: '1px solid #f59e0b', padding: '6px 14px', borderRadius: '12px' }}
            title={t.manualSeatsSubtitle}
          >
            <span>{t.availableSeats}:</span>
            <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{user.nbdisponibilite ?? 0}</strong>
            <Edit3 size={14} style={{ marginLeft: '4px' }} />
          </button>
        )}

        <LanguageSwitcher />

        <button
          onClick={() => {
            console.debug('Manual sync triggered from Navbar');
            refreshLocalData();
          }}
          className="btn-secondary"
          style={{ fontSize: '0.82rem', padding: '6px 10px', borderRadius: '8px' }}
          title="Forcer la synchronisation locale"
        >
          🔄 Sync
        </button>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '10px', fontSize: '0.85rem' }}>
            <User size={16} color="#38bdf8" />
            <span><strong>{user.prenom} {user.nom}</strong></span>
            <span style={{ color: '#9ca3af' }}>({user.phone})</span>
          </div>
        )}
      </div>
    </header>
  );
};
