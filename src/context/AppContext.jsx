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
    return unsubscribe;
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

  // Actions
  const t = translations[language] || translations.fr;

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'fr' ? 'ar' : 'fr'));
  };

  const registerUser = async (userData) => {
    const newUser = {
      id: 'usr_' + Date.now(),
      createdAt: new Date().toISOString(),
      ...userData
    };

    // Save to Cloud accounts registry
    const updatedAccounts = await saveAccountDB(newUser);
    setAccounts(updatedAccounts);

    setUser(newUser);
    setActiveRole(newUser.role);

    if (userData.role === 'transporteur') {
      const driverObj = {
        id: newUser.id,
        nom: newUser.nom,
        prenom: newUser.prenom,
        phone: newUser.phone,
        carModel: newUser.carModel || 'Véhicule',
        totalSeats: parseInt(newUser.totalSeats) || 4,
        nbdisponibilite: parseInt(newUser.initialSeats) || 4,
        routeSource: 'Achaacha',
        routeDest: 'Mostaganem',
        location: { lat: 36.242, lng: 0.285 }
      };
      await createOrUpdateDriverDB(driverObj);
      setTransporteurs(getTransporteursDB());
    }

    setCurrentView('dashboard');
  };

  const switchAccount = (accountData) => {
    setUser(accountData);
    setActiveRole(accountData.role);
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
    sendMessage(requestId, `⏰ ${t.quickTimeConfirmed} (${time})`);
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
        switchAccount,
        clearDatabase,
        currentView,
        setCurrentView,
        activeRole,
        setActiveRole,
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
