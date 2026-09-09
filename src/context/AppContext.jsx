import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { translations } from '../utils/translations';
import {
  getTransporteursDB,
  saveTransporteursDB,
  getRideRequestsDB,
  saveRideRequestsDB,
  getMessagesDB,
  saveMessagesDB,
  getReadMessagesDB,
  markMessagesAsReadDB,
  getAccountsDB,
  saveAccountDB,
  deleteAccountDB,
  clearDatabaseDB,
  subscribeToSync,
  subscribeToTransporteursDB,
  subscribeToRideRequestsDB,
  subscribeToMessagesDB,
  subscribeToAccountsDB,
  subscribeToReadMessagesDB,
  createOrUpdateDriverDB,
  updateDriverSeatsDB,
  createRideRequestDB,
  acceptRideRequestDB,
  setFinalAgreedTimeDB,
  cancelRideRequestDB,
  isFirebaseConfigured
} from '../utils/mockDatabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Accounts list
  const [accounts, setAccounts] = useState(getAccountsDB);

  // Saved Active User state — persisted in localStorage (session locale)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('achaachaclo_user_v3');
    return saved ? JSON.parse(saved) : null;
  });

  // Current active view role: 'client' or 'transporteur'
  const [activeRole, setActiveRole] = useState(() => {
    const saved = localStorage.getItem('achaachaclo_role_v3');
    return saved || 'client';
  });

  const [editingAccount, setEditingAccount] = useState(null);

  // Current navigation view mode: 'account_select' | 'onboarding' | 'dashboard'
  const [currentView, setCurrentView] = useState(() => {
    const savedUser = localStorage.getItem('achaachaclo_user_v3');
    if (savedUser) return 'dashboard';
    const accs = getAccountsDB();
    return accs.length > 0 ? 'account_select' : 'onboarding';
  });

  // Language: 'fr' or 'ar'
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('achaachaclo_lang');
    return saved || 'fr';
  });

  // DB States
  const [transporteurs, setTransporteurs] = useState(getTransporteursDB);
  const [rideRequests, setRideRequests] = useState(getRideRequestsDB);
  const [messages, setMessages] = useState(getMessagesDB);
  const [readMessages, setReadMessages] = useState(getReadMessagesDB);

  // Firebase status
  const [firebaseActive] = useState(isFirebaseConfigured);

  // Active Modals & Selection
  const [activeChatReq, setActiveChatReq] = useState(null);
  const [routeSchemaReq, setRouteSchemaReq] = useState(null);

  // Track user ref for subscriptions
  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  // Notification chime
  const playNotificationSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn('Audio effect failed', e);
    }
  };

  const refreshLocalData = () => {
    setAccounts(getAccountsDB());
    setTransporteurs(getTransporteursDB());
    setRideRequests(getRideRequestsDB());
    setMessages(getMessagesDB());
    setReadMessages(getReadMessagesDB());
  };

  const syncDriverRecordsFromAccounts = async () => {
    const accountsList = getAccountsDB();
    const driverAccounts = accountsList.filter(account => account.role === 'transporteur');
    const currentDrivers = getTransporteursDB();

    const nextDrivers = [...currentDrivers];

    for (const account of driverAccounts) {
      const resolvedTotalSeats = Number.isFinite(Number.parseInt(account.totalSeats, 10)) ? Number.parseInt(account.totalSeats, 10) : 4;
      const resolvedInitialSeats = Number.isFinite(Number.parseInt(account.initialSeats, 10)) ? Number.parseInt(account.initialSeats, 10) : Number.isFinite(Number.parseInt(account.nbdisponibilite, 10)) ? Number.parseInt(account.nbdisponibilite, 10) : resolvedTotalSeats;
      const driverRecord = {
        id: account.id,
        nom: account.nom,
        prenom: account.prenom,
        phone: account.phone,
        carModel: account.carModel || 'Véhicule',
        totalSeats: resolvedTotalSeats,
        nbdisponibilite: Math.max(0, resolvedInitialSeats),
        routeSource: 'Achaacha',
        routeDest: 'Mostaganem',
        location: { lat: 36.242, lng: 0.285 }
      };

      const index = nextDrivers.findIndex(driver => driver.id === account.id);
      if (index >= 0) {
        nextDrivers[index] = { ...nextDrivers[index], ...driverRecord };
      } else {
        nextDrivers.push(driverRecord);
      }
    }

    const filteredDrivers = nextDrivers.filter(driver => {
      const matchesAccount = !accountsList.some(account => account.id === driver.id && account.role === 'transporteur');
      return matchesAccount || driver.id;
    });

    if (filteredDrivers.length !== currentDrivers.length || filteredDrivers.some((driver, index) => driver.id !== currentDrivers[index]?.id || driver.nbdisponibilite !== currentDrivers[index]?.nbdisponibilite || driver.carModel !== currentDrivers[index]?.carModel)) {
      await saveTransporteursDB(filteredDrivers);
      setTransporteurs(filteredDrivers);
    }
  };

  // ============================================================
  // FIREBASE REAL-TIME SUBSCRIPTIONS (cross-device sync)
  // ============================================================
  useEffect(() => {
    const unsubTransporteurs = subscribeToTransporteursDB((data) => {
      setTransporteurs(data);
    });
    const unsubRequests = subscribeToRideRequestsDB((data) => {
      setRideRequests(data);
      if (userRef.current) playNotificationSound();
    });
    const unsubMessages = subscribeToMessagesDB((data) => {
      setMessages(data);
      if (userRef.current) playNotificationSound();
    });
    const unsubAccounts = subscribeToAccountsDB((data) => {
      setAccounts(data);
      // Auto-refresh logged-in user data from cloud
      if (userRef.current) {
        const freshUser = data.find(a => a.id === userRef.current.id);
        if (freshUser) {
          setUser(prev => ({ ...prev, ...freshUser }));
        }
      }
    });

    return () => {
      unsubTransporteurs();
      unsubRequests();
      unsubMessages();
      unsubAccounts();
    };
  }, []);

  // Subscribe to read messages for current user (Firebase)
  useEffect(() => {
    if (!user) return;
    const unsubRead = subscribeToReadMessagesDB(user.id, (data) => {
      setReadMessages(data);
    });
    return unsubRead;
  }, [user?.id]);

  // Sync effect across tabs in same browser (BroadcastChannel fallback)
  useEffect(() => {
    const unsubscribe = subscribeToSync((event) => {
      if (event.type === 'TRANSPORTEURS_UPDATED') {
        setTransporteurs(event.payload);
      } else if (event.type === 'REQUESTS_UPDATED') {
        setRideRequests(event.payload);
      } else if (event.type === 'MESSAGES_UPDATED') {
        setMessages(event.payload);
      } else if (event.type === 'READ_UPDATED') {
        setReadMessages(event.payload);
      } else if (event.type === 'ACCOUNTS_UPDATED') {
        setAccounts(event.payload);
      } else if (event.type === 'DB_CLEARED') {
        setTransporteurs([]);
        setRideRequests([]);
        setMessages([]);
        setReadMessages([]);
        setAccounts([]);
        setUser(null);
        setCurrentView('onboarding');
      }
    });

    const handleStorage = () => {
      refreshLocalData();
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Mark active chat messages as read automatically
  useEffect(() => {
    if (activeChatReq && user) {
      markMessagesAsReadDB(activeChatReq.id, user.id).then(updatedRead => {
        setReadMessages(updatedRead);
      });
    }
  }, [activeChatReq, messages, user]);

  // Update HTML document direction and title based on language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('achaachaclo_lang', language);
  }, [language]);

  // Persist user & role changes in localStorage (session)
  useEffect(() => {
    if (user) {
      localStorage.setItem('achaachaclo_user_v3', JSON.stringify(user));
    } else {
      localStorage.removeItem('achaachaclo_user_v3');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('achaachaclo_role_v3', activeRole);
  }, [activeRole]);

  useEffect(() => {
    if (currentView === 'account_select' || !user) {
      refreshLocalData();
    }
  }, [currentView, user]);

  // Actions
  const t = translations[language] || translations.fr;

  const normalizePhone = (value) => (value || '').replace(/\D/g, '');

  const findDuplicateAccount = (payload, ignoreId = null) => {
    const phone = normalizePhone(payload.phone);
    return getAccountsDB().find(account => {
      if (!account || !account.phone) return false;
      if (ignoreId && account.id === ignoreId) return false;
      return normalizePhone(account.phone) === phone;
    });
  };

  const generateUniqueAccountId = () => {
    const safeRandom = () => Math.random().toString(36).slice(2, 10);
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return `usr_${window.crypto.randomUUID()}`;
    }
    return `usr_${Date.now()}_${safeRandom()}_${safeRandom()}`;
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'fr' ? 'ar' : 'fr'));
  };

  const registerUser = async (userData) => {
    const phone = normalizePhone(userData.phone);
    const duplicate = findDuplicateAccount({ ...userData, phone });

    if (duplicate) {
      alert('Ce compte existe déjà. Un numéro de téléphone ne peut pas être utilisé deux fois.');
      return null;
    }

    const resolvedTotalSeats = Number.isFinite(Number.parseInt(userData.totalSeats, 10)) ? Number.parseInt(userData.totalSeats, 10) : 4;
    const resolvedInitialSeats = Number.isFinite(Number.parseInt(userData.initialSeats, 10)) ? Number.parseInt(userData.initialSeats, 10) : resolvedTotalSeats;

    const newUser = {
      id: generateUniqueAccountId(),
      createdAt: new Date().toISOString(),
      ...userData,
      phone,
      totalSeats: userData.role === 'transporteur' ? resolvedTotalSeats : undefined,
      initialSeats: userData.role === 'transporteur' ? resolvedInitialSeats : undefined,
      nbdisponibilite: userData.role === 'transporteur' ? resolvedInitialSeats : undefined
    };

    const updatedAccounts = await saveAccountDB(newUser);
    setAccounts(updatedAccounts);
    setEditingAccount(null);
    setActiveRole(newUser.role);

    if (userData.role === 'transporteur') {
      const driverObj = {
        id: newUser.id,
        nom: newUser.nom,
        prenom: newUser.prenom,
        phone: newUser.phone,
        carModel: newUser.carModel || 'Véhicule',
        totalSeats: resolvedTotalSeats,
        nbdisponibilite: resolvedInitialSeats,
        routeSource: 'Achaacha',
        routeDest: 'Mostaganem',
        location: { lat: 36.242, lng: 0.285 }
      };
      await createOrUpdateDriverDB(driverObj);
      await syncDriverRecordsFromAccounts();
      setTransporteurs(getTransporteursDB());
    }

    refreshLocalData();
    setUser(null);
    setCurrentView('account_select');
    alert('Compte créé avec succès !');
    return updatedAccounts;
  };

  const updateAccount = async (accountData) => {
    const phone = normalizePhone(accountData.phone);
    const duplicate = findDuplicateAccount({ ...accountData, phone }, accountData.id);

    if (duplicate) {
      alert('Ce compte existe déjà. Un numéro de téléphone ne peut pas être utilisé deux fois.');
      return null;
    }

    const resolvedTotalSeats = Number.isFinite(Number.parseInt(accountData.totalSeats, 10)) ? Number.parseInt(accountData.totalSeats, 10) : 4;
    const resolvedInitialSeats = Number.isFinite(Number.parseInt(accountData.initialSeats, 10)) ? Number.parseInt(accountData.initialSeats, 10) : resolvedTotalSeats;

    const updatedAccount = {
      ...accountData,
      phone,
      totalSeats: accountData.role === 'transporteur' ? resolvedTotalSeats : undefined,
      initialSeats: accountData.role === 'transporteur' ? resolvedInitialSeats : undefined,
      nbdisponibilite: accountData.role === 'transporteur' ? resolvedInitialSeats : undefined
    };

    const updatedAccounts = await saveAccountDB(updatedAccount);
    setAccounts(updatedAccounts);
    setEditingAccount(null);

    if (accountData.role === 'transporteur') {
      const driverObj = {
        id: updatedAccount.id,
        nom: updatedAccount.nom,
        prenom: updatedAccount.prenom,
        phone: updatedAccount.phone,
        carModel: updatedAccount.carModel || 'Véhicule',
        totalSeats: resolvedTotalSeats,
        nbdisponibilite: resolvedInitialSeats,
        routeSource: 'Achaacha',
        routeDest: 'Mostaganem',
        location: { lat: 36.242, lng: 0.285 }
      };
      await createOrUpdateDriverDB(driverObj);
      setTransporteurs(getTransporteursDB());
    }

    refreshLocalData();
    setUser(null);
    setCurrentView('account_select');
    alert('Compte mis à jour avec succès !');
    return updatedAccounts;
  };

  const deleteAccount = async (accountId) => {
    const updatedAccounts = await deleteAccountDB(accountId);
    setAccounts(updatedAccounts);

    const driverList = getTransporteursDB().filter(d => d.id !== accountId);
    await saveTransporteursDB(driverList);
    setTransporteurs(driverList);

    if (user && user.id === accountId) {
      setUser(null);
    }

    setCurrentView('account_select');
    setEditingAccount(null);
    return updatedAccounts;
  };

  const switchAccount = (accountData) => {
    setUser(accountData);
    setActiveRole(accountData.role);
    setAccounts(getAccountsDB());
    syncDriverRecordsFromAccounts();
    setTransporteurs(getTransporteursDB());
    setCurrentView('dashboard');
  };

  const clearDatabase = async () => {
    if (window.confirm(t.emptyDbConfirm)) {
      await clearDatabaseDB();
      setTransporteurs([]);
      setRideRequests([]);
      setMessages([]);
      setReadMessages([]);
      setAccounts([]);
      setUser(null);
      setCurrentView('onboarding');
    }
  };

  const updateDriverSeats = async (newSeats) => {
    if (!user || user.role !== 'transporteur') return;
    const updatedUser = { ...user, nbdisponibilite: parseInt(newSeats) || 0 };
    setUser(updatedUser);
    await saveAccountDB(updatedUser);
    setAccounts(getAccountsDB());

    const updatedDrivers = await updateDriverSeatsDB(user.id, newSeats);
    setTransporteurs(updatedDrivers);
  };

  const bookRideDiniM3ak = async (driver, requestedSeats, source, dest, departureTime, sourceCoords, destCoords) => {
    if (!user) return;
    const req = await createRideRequestDB({
      clientId: user.id,
      clientNom: user.nom,
      clientPrenom: user.prenom,
      clientPhone: user.phone,
      driverId: driver.id,
      driverNom: driver.nom,
      driverPrenom: driver.prenom,
      driverPhone: driver.phone,
      carModel: driver.carModel,
      requestedSeats: parseInt(requestedSeats),
      source: source || 'Achaacha Centre',
      destination: dest || 'Mostaganem Ville',
      departureTime: departureTime || '08:30',
      sourceCoords: sourceCoords || { lat: 36.242, lng: 0.285 },
      destCoords: destCoords || { lat: 35.933, lng: 0.089 },
      driverCoords: driver.location || { lat: 36.240, lng: 0.280 }
    });
    setRideRequests(getRideRequestsDB());
    playNotificationSound();
    return req;
  };

  const acceptRideOkRakM3aya = async (requestId, unitPrice, driverDepartureTime) => {
    const updatedRequests = await acceptRideRequestDB(requestId, unitPrice, driverDepartureTime);
    setRideRequests(updatedRequests);
    setTransporteurs(getTransporteursDB());

    const acceptedRequest = updatedRequests.find(req => req.id === requestId);
    if (acceptedRequest && user && user.role === 'transporteur') {
      const confirmationText = `🚘 okRakM3aya: confirmé pour ${acceptedRequest.requestedSeats} place(s) à ${unitPrice} DZD/place. Heure proposée: ${driverDepartureTime || acceptedRequest.departureTime || '08:30'}.`;
      await sendMessage(requestId, confirmationText);
    }

    if (user && user.role === 'transporteur') {
      const currentDriver = getTransporteursDB().find(d => d.id === user.id);
      if (currentDriver) {
        const updatedUser = { ...user, nbdisponibilite: currentDriver.nbdisponibilite };
        setUser(updatedUser);
        await saveAccountDB(updatedUser);
      }
    }
    playNotificationSound();
  };

  const setFinalAgreedTime = async (requestId, time) => {
    const updatedRequests = await setFinalAgreedTimeDB(requestId, time);
    setRideRequests(updatedRequests);
    const request = updatedRequests.find(req => req.id === requestId);
    if (request) {
      const notificationText = `⏰ ${t.quickTimeConfirmed} (${time})`;
      await sendMessage(requestId, notificationText);
    }
  };

  const cancelRide = async (requestId) => {
    const updatedRequests = await cancelRideRequestDB(requestId);
    setRideRequests(updatedRequests);
    setTransporteurs(getTransporteursDB());

    if (user && user.role === 'transporteur') {
      const currentDriver = getTransporteursDB().find(d => d.id === user.id);
      if (currentDriver) {
        const updatedUser = { ...user, nbdisponibilite: currentDriver.nbdisponibilite };
        setUser(updatedUser);
        await saveAccountDB(updatedUser);
      }
    }
  };

  const sendMessage = async (requestId, text) => {
    if (!text.trim() || !user) return;
    const newMsg = {
      id: 'msg_' + Date.now(),
      requestId,
      senderId: user.id,
      senderRole: user.role || activeRole,
      senderName: `${user.prenom} ${user.nom}`,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const allMsgs = [...getMessagesDB(), newMsg];
    await saveMessagesDB(allMsgs);
    setMessages(allMsgs);

    await markMessagesAsReadDB(requestId, user.id);
    playNotificationSound();
  };

  // Helper to count unread messages for a specific request
  const getUnreadMessageCount = (requestId) => {
    if (!user || !requestId) return 0;
    const readSet = new Set(readMessages);
    return messages.filter(m => m.requestId === requestId && m.senderId !== user.id && !readSet.has(`${m.id}_${user.id}`)).length;
  };

  // Total unread messages count for current user
  const getTotalUnreadCount = () => {
    if (!user) return 0;
    const readSet = new Set(readMessages);
    return messages.filter(m => m.senderId !== user.id && !readSet.has(`${m.id}_${user.id}`)).length;
  };

  return (
    <AppContext.Provider
      value={{
        t,
        language,
        toggleLanguage,
        user,
        setUser,
        accounts,
        registerUser,
        updateAccount,
        deleteAccount,
        switchAccount,
        clearDatabase,
        currentView,
        setCurrentView,
        activeRole,
        setActiveRole,
        editingAccount,
        setEditingAccount,
        transporteurs,
        rideRequests,
        messages,
        updateDriverSeats,
        bookRideDiniM3ak,
        acceptRideOkRakM3aya,
        setFinalAgreedTime,
        cancelRide,
        sendMessage,
        getUnreadMessageCount,
        getTotalUnreadCount,
        activeChatReq,
        setActiveChatReq,
        routeSchemaReq,
        setRouteSchemaReq,
        firebaseActive
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
