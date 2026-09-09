import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Monitor, Smartphone, Check } from 'lucide-react';

export const PwaInstallPrompt = () => {
  const { t, activeRole } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("Pour installer sur Windows, Android ou iPhone:\n- Chrome/Edge: Cliquez sur l'icône 'Installer' dans la barre d'adresse.\n- iPhone (Safari): Appuyez sur 'Partager' puis 'Sur l'écran d'accueil'.");
    }
  };

  if (installed) return null;

  const roleText = activeRole === 'client' ? 'Partie Client' : 'Partie Transporteur';

  return (
    <div className="glass-card" style={{ margin: '0 0 20px 0', padding: '14px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', border: '1px solid rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: '#f59e0b', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
          <Download size={20} />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
            {t.installApp} ({roleText})
          </h4>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Monitor size={14} /> Windows | <Smartphone size={14} /> Android & iPhone
          </p>
        </div>
      </div>

      <button onClick={handleInstallClick} className="btn-dinim3ak" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
        <Download size={14} />
        {t.installBtn}
      </button>
    </div>
  );
};
