import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AccountSelector } from './views/AccountSelector';
import { Onboarding } from './views/Onboarding';
import { ClientDashboard } from './views/ClientDashboard';
import { TransporteurDashboard } from './views/TransporteurDashboard';
import { ManualSeatModal } from './components/ManualSeatModal';
import { RouteSchemaModal } from './components/RouteSchemaModal';
import { ChatModal } from './components/ChatModal';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';

function MainLayout() {
  const {
    user,
    activeRole,
    currentView,
    setCurrentView,
    switchAccount,
    clearDatabase,
    firebaseActive,
    setEditingAccount,
    deleteAccount,
    updateAccount
  } = useApp();

  const [isManualSeatsOpen, setIsManualSeatsOpen] = useState(false);

  // 1. Account Selector View
  if (currentView === 'account_select') {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <AccountSelector
          onSelectAccount={(acc) => switchAccount(acc)}
          onCreateNewAccount={() => {
            setEditingAccount(null);
            setCurrentView('onboarding');
          }}
          onEditAccount={(acc) => {
            setEditingAccount(acc);
            setCurrentView('onboarding');
          }}
          onDeleteAccount={(acc) => deleteAccount(acc.id)}
          onClearDb={clearDatabase}
        />
      </div>
    );
  }

  // 2. Onboarding View
  if (currentView === 'onboarding') {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Onboarding />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <AccountSelector
          onSelectAccount={(acc) => switchAccount(acc)}
          onCreateNewAccount={() => {
            setEditingAccount(null);
            setCurrentView('onboarding');
          }}
          onEditAccount={(acc) => {
            setEditingAccount(acc);
            setCurrentView('onboarding');
          }}
          onDeleteAccount={(acc) => deleteAccount(acc.id)}
          onClearDb={clearDatabase}
        />
      </div>
    );
  }

  // 3. Dashboard Main View
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 40px 20px' }}>
      {!firebaseActive && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 16px',
          borderRadius: '12px',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.45)',
          color: '#fcd34d',
          fontWeight: 700,
          fontSize: '0.92rem'
        }}>
          ⚠️ Partage multi-appareils désactivé : Firebase n’est pas configuré dans cet environnement. Ajoutez les variables VITE_FIREBASE_* dans Vercel et redéployez pour que les chauffeurs apparaissent sur plusieurs téléphones.
        </div>
      )}

      <Navbar onOpenManualSeats={() => setIsManualSeatsOpen(true)} />
      
      <PwaInstallPrompt />

      <main>
        {activeRole === 'client' ? (
          <ClientDashboard />
        ) : (
          <TransporteurDashboard onOpenManualSeats={() => setIsManualSeatsOpen(true)} />
        )}
      </main>

      <ManualSeatModal
        isOpen={isManualSeatsOpen}
        onClose={() => setIsManualSeatsOpen(false)}
      />

      <RouteSchemaModal />
      <ChatModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
