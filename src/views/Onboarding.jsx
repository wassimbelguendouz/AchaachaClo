import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/BackButton';
import { User, Phone, Car, Users, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const Onboarding = () => {
  const { t, registerUser, activeRole, setActiveRole, accounts, setCurrentView } = useApp();

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Transporteur specific extra fields
  const [carModel, setCarModel] = useState('Dacia Logan');
  const [totalSeats, setTotalSeats] = useState('4');
  const [initialSeats, setInitialSeats] = useState('4');

  // Algerian phone regex: 10 digits starting with 05, 06, or 07
  const validatePhone = (phoneNumber) => {
    const regex = /^(05|06|07)\d{8}$/;
    return regex.test(phoneNumber.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPhoneError('');

    if (!nom.trim() || !prenom.trim() || !phone.trim()) {
      alert("Veuillez remplir tous les champs obligatoires (Nom, Prénom, Téléphone).");
      return;
    }

    // REQUIREMENT 1: Strict Algerian Phone Number Validation
    if (!validatePhone(phone)) {
      setPhoneError(t.invalidPhoneError);
      return;
    }

    registerUser({
      nom: nom.trim(),
      prenom: prenom.trim(),
      phone: phone.trim(),
      role: activeRole,
      carModel: activeRole === 'transporteur' ? carModel : undefined,
      totalSeats: activeRole === 'transporteur' ? parseInt(totalSeats) : undefined,
      initialSeats: activeRole === 'transporteur' ? parseInt(initialSeats) : undefined,
    });
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      
      {accounts.length > 0 && (
        <div style={{ alignSelf: 'flex-start', marginBottom: '16px' }}>
          <BackButton onClick={() => setCurrentView('account_select')} label={t.selectAccountTitle} />
        </div>
      )}

      <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '36px', borderRadius: '24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #f59e0b, #3b82f6)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '14px',
            boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)'
          }}>
            <Car size={36} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#fff' }}>
            {t.welcomeTitle}
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '6px' }}>
            {t.welcomeSubtitle}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '14px', padding: '4px', display: 'flex', gap: '4px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            type="button"
            onClick={() => setActiveRole('client')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: activeRole === 'client' ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' : 'transparent',
              color: activeRole === 'client' ? '#fff' : '#9ca3af',
              transition: 'all 0.2s'
            }}
          >
            👤 {t.clientRole}
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('transporteur')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: activeRole === 'transporteur' ? 'linear-gradient(135deg, #f59e0b, #10b981)' : 'transparent',
              color: activeRole === 'transporteur' ? '#fff' : '#9ca3af',
              transition: 'all 0.2s'
            }}
          >
            🚘 {t.driverRole}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
              {t.lastName} *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Ex: Amrani"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
              {t.firstName} *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Ex: Karim"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
              {t.phone} *
            </label>
            <input
              type="tel"
              maxLength={10}
              className="input-field"
              placeholder="0661234567"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, ''));
                setPhoneError('');
              }}
              required
              style={{ borderColor: phoneError ? '#ef4444' : undefined, fontWeight: 700 }}
            />
            {phoneError && (
              <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <AlertCircle size={14} /> {phoneError}
              </div>
            )}
          </div>

          {/* Transporteur specific fields */}
          {activeRole === 'transporteur' && (
            <>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#fbbf24', marginBottom: '6px' }}>
                  {t.carModel}
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: Dacia Logan, Renault Symbol"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                    {t.totalSeats}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    className="input-field"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24', marginBottom: '6px' }}>
                    {t.initialSeats} (`nbdisponibilite`)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={totalSeats}
                    className="input-field"
                    value={initialSeats}
                    onChange={(e) => setInitialSeats(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '12px', padding: '14px', borderRadius: '14px', fontSize: '1.05rem' }}>
            <ShieldCheck size={20} />
            {t.createAccount}
          </button>
        </form>

      </div>
    </div>
  );
};
