// 🔥 Firebase Cloud Database — AchaachaClo
// Synchronisation en temps réel via Firebase Firestore
// Fallback automatique sur localStorage si Firebase non configuré

import { db, isFirebaseConfigured } from '../firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

// ============================================================
// BROADCAST CHANNEL (sync entre onglets du même navigateur)
// ============================================================
const channel = new BroadcastChannel('achaachaclo_channel');

// ============================================================
// LOCAL STORAGE KEYS (fallback)
// ============================================================
const STORAGE_KEYS = {
  TRANSPORTEURS: 'achaachaclo_transporteurs_v3',
  RIDE_REQUESTS: 'achaachaclo_requests_v3',
  MESSAGES: 'achaachaclo_messages_v3',
  ACCOUNTS: 'achaachaclo_accounts_v3',
  USER: 'achaachaclo_user_v3',
  READ_MESSAGES: 'achaachaclo_read_messages_v3'
};

// ============================================================
// FIREBASE COLLECTION NAMES
// ============================================================
const COLLECTIONS = {
  TRANSPORTEURS: 'transporteurs',
  RIDE_REQUESTS: 'rideRequests',
  MESSAGES: 'messages',
  ACCOUNTS: 'accounts',
  READ_MESSAGES: 'readMessages'
};

// ============================================================
// HELPERS GENERIQUES
// ============================================================
const localGet = (key, fallback = []) => {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : fallback;
  } catch { return fallback; }
};

const localSet = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

const emitSyncEvent = (type, payload) => {
  const event = { type, payload, ts: Date.now() };
  localSet('achaachaclo_sync_event_v3', event);
  channel.postMessage(event);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('achaachaclo_sync_custom', { detail: event }));
  }
};

const mergeById = (existing = [], incoming = []) => {
  const map = new Map();
  [...existing, ...incoming].forEach(item => {
    if (!item || !item.id) return;
    map.set(item.id, item);
  });
  return Array.from(map.values());
};

const localSetSafeFromEmptyRemote = (key, value) => {
  try {
    const current = localGet(key, []);
    if (Array.isArray(value) && value.length === 0 && Array.isArray(current) && current.length > 0) {
      return;
    }
    console.debug(`localSetSafeFromEmptyRemote: setting ${key} (items: ${Array.isArray(value) ? value.length : 'n/a'})`);
    localSet(key, value);
  } catch {
    localSet(key, value);
  }
};

// ============================================================
// TRANSPORTEURS
// ============================================================

export const getTransporteursDB = () => localGet(STORAGE_KEYS.TRANSPORTEURS, []);

export const saveTransporteursDB = async (transporteurs) => {
  const merged = mergeById(getTransporteursDB(), transporteurs);
  console.debug('saveTransporteursDB: saving', merged.length, 'transporteurs');
  localSet(STORAGE_KEYS.TRANSPORTEURS, merged);
  emitSyncEvent('TRANSPORTEURS_UPDATED', merged);

  if (isFirebaseConfigured && db) {
    // Clear and re-save all (simple sync strategy)
    const col = collection(db, COLLECTIONS.TRANSPORTEURS);
    for (const t of transporteurs) {
      await setDoc(doc(col, t.id), { ...t, _updatedAt: serverTimestamp() });
    }
  }
};

export const subscribeToTransporteursDB = (callback) => {
  if (!isFirebaseConfigured || !db) return () => {};
  const col = collection(db, COLLECTIONS.TRANSPORTEURS);
  return onSnapshot(col, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    localSetSafeFromEmptyRemote(STORAGE_KEYS.TRANSPORTEURS, data);
    callback(data);
  });
};

// ============================================================
// RIDE REQUESTS
// ============================================================

export const getRideRequestsDB = () => localGet(STORAGE_KEYS.RIDE_REQUESTS, []);

export const saveRideRequestsDB = async (requests) => {
  const merged = mergeById(getRideRequestsDB(), requests);
  console.debug('saveRideRequestsDB: saving', merged.length, 'requests');
  localSet(STORAGE_KEYS.RIDE_REQUESTS, merged);
  emitSyncEvent('REQUESTS_UPDATED', merged);

  if (isFirebaseConfigured && db) {
    const col = collection(db, COLLECTIONS.RIDE_REQUESTS);
    for (const r of requests) {
      await setDoc(doc(col, r.id), { ...r, _updatedAt: serverTimestamp() });
    }
  }
};

export const subscribeToRideRequestsDB = (callback) => {
  if (!isFirebaseConfigured || !db) return () => {};
  const col = collection(db, COLLECTIONS.RIDE_REQUESTS);
  const q = query(col, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    localSetSafeFromEmptyRemote(STORAGE_KEYS.RIDE_REQUESTS, data);
    callback(data);
  });
};

// ============================================================
// MESSAGES
// ============================================================

export const getMessagesDB = () => localGet(STORAGE_KEYS.MESSAGES, []);

export const saveMessagesDB = async (messages) => {
  const merged = mergeById(getMessagesDB(), messages);
  console.debug('saveMessagesDB: saving', merged.length, 'messages');
  localSet(STORAGE_KEYS.MESSAGES, merged);
  emitSyncEvent('MESSAGES_UPDATED', merged);

  if (isFirebaseConfigured && db) {
    const col = collection(db, COLLECTIONS.MESSAGES);
    for (const m of messages) {
      await setDoc(doc(col, m.id), { ...m, _updatedAt: serverTimestamp() });
    }
  }
};

export const subscribeToMessagesDB = (callback) => {
  if (!isFirebaseConfigured || !db) return () => {};
  const col = collection(db, COLLECTIONS.MESSAGES);
  return onSnapshot(col, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    localSetSafeFromEmptyRemote(STORAGE_KEYS.MESSAGES, data);
    callback(data);
  });
};

// ============================================================
// READ MESSAGES (par user/message)
// ============================================================

export const getReadMessagesDB = () => localGet(STORAGE_KEYS.READ_MESSAGES, []);

export const markMessagesAsReadDB = async (requestId, userId) => {
  const messages = getMessagesDB();
  const readList = new Set(getReadMessagesDB());
  messages.filter(m => m.requestId === requestId).forEach(m => readList.add(`${m.id}_${userId}`));
  const arr = Array.from(readList);
  console.debug('markMessagesAsReadDB: marking read for user', userId, 'on request', requestId, 'count', arr.length);
  localSet(STORAGE_KEYS.READ_MESSAGES, arr);
  emitSyncEvent('READ_UPDATED', arr);

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, COLLECTIONS.READ_MESSAGES, `read_${userId}`);
    await setDoc(docRef, { items: arr, _updatedAt: serverTimestamp() }, { merge: true });
  }
  return arr;
};

export const subscribeToReadMessagesDB = (userId, callback) => {
  if (!isFirebaseConfigured || !db) return () => {};
  const docRef = doc(db, COLLECTIONS.READ_MESSAGES, `read_${userId}`);
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      const arr = snap.data().items || [];
      localSetSafeFromEmptyRemote(STORAGE_KEYS.READ_MESSAGES, arr);
      callback(arr);
    }
  });
};

// ============================================================
// ACCOUNTS (comptes utilisateurs)
// ============================================================

export const getAccountsDB = () => localGet(STORAGE_KEYS.ACCOUNTS, []);

export const saveAccountDB = async (accountData) => {
  const accounts = getAccountsDB();
  const existingIdx = accounts.findIndex(a => a.id === accountData.id);
  let updated;
  if (existingIdx >= 0) {
    accounts[existingIdx] = { ...accounts[existingIdx], ...accountData };
    updated = accounts;
  } else {
    updated = [accountData, ...accounts];
  }
  const merged = mergeById(accounts, updated);
  console.debug('saveAccountDB: saving account', accountData.id, accountData.phone);
  localSet(STORAGE_KEYS.ACCOUNTS, merged);
  emitSyncEvent('ACCOUNTS_UPDATED', merged);

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, COLLECTIONS.ACCOUNTS, accountData.id);
    await setDoc(docRef, { ...accountData, _updatedAt: serverTimestamp() }, { merge: true });
  }
  return updated;
};

export const deleteAccountDB = async (accountId) => {
  const accounts = getAccountsDB().filter(a => a.id !== accountId);
  localSet(STORAGE_KEYS.ACCOUNTS, accounts);
  channel.postMessage({ type: 'ACCOUNTS_UPDATED', payload: accounts });

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, COLLECTIONS.ACCOUNTS, accountId);
    await deleteDoc(docRef);
  }
  return accounts;
};

export const subscribeToAccountsDB = (callback) => {
  if (!isFirebaseConfigured || !db) return () => {};
  const col = collection(db, COLLECTIONS.ACCOUNTS);
  return onSnapshot(col, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    localSetSafeFromEmptyRemote(STORAGE_KEYS.ACCOUNTS, data);
    callback(data);
  });
};

// ============================================================
// CLEAR DATABASE
// ============================================================

export const clearDatabaseDB = async () => {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  channel.postMessage({ type: 'DB_CLEARED' });

  if (isFirebaseConfigured && db) {
    // Delete all docs in each collection
    for (const colName of Object.values(COLLECTIONS)) {
      const col = collection(db, colName);
      const snap = await getDocs(col);
      const deletions = snap.docs.map(d => deleteDoc(doc(db, colName, d.id)));
      await Promise.all(deletions);
    }
  }
};

// ============================================================
// ACTIONS METIER (inchangées, utilisent les fonctions ci-dessus)
// ============================================================

export const createOrUpdateDriverDB = async (driverData) => {
  const drivers = getTransporteursDB();
  const existingIdx = drivers.findIndex(d => d.id === driverData.id);
  let updated;
  if (existingIdx >= 0) {
    drivers[existingIdx] = { ...drivers[existingIdx], ...driverData };
    updated = drivers;
  } else {
    updated = [...drivers, driverData];
  }
  await saveTransporteursDB(updated);
  return driverData;
};

export const updateDriverSeatsDB = async (driverId, newNbSeats) => {
  const drivers = getTransporteursDB();
  const updated = drivers.map(d => {
    if (d.id === driverId) {
      return { ...d, nbdisponibilite: Math.max(0, parseInt(newNbSeats) || 0) };
    }
    return d;
  });
  await saveTransporteursDB(updated);
  return updated;
};

export const createRideRequestDB = async (requestData) => {
  const requests = getRideRequestsDB();
  const newReq = {
    id: 'req_' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    driverDecisionText: 'En attente de décision du chauffeur...',
    driverDepartureTime: null,
    finalAgreedTime: null,
    ...requestData
  };
  const updated = [newReq, ...requests];
  await saveRideRequestsDB(updated);
  return newReq;
};

export const acceptRideRequestDB = async (requestId, unitPrice, driverDepartureTime) => {
  const requests = getRideRequestsDB();
  const drivers = getTransporteursDB();

  let targetDriverId = null;
  let seatsToDecrement = 0;

  const updatedRequests = requests.map(req => {
    if (req.id === requestId) {
      targetDriverId = req.driverId;
      seatsToDecrement = parseInt(req.requestedSeats) || 1;
      return {
        ...req,
        status: 'accepted',
        driverDecisionText: `Décision : Acceptée avec okRakM3aya (${unitPrice} DZD/place)`,
        unitPrice: parseFloat(unitPrice) || 0,
        totalPrice: (parseFloat(unitPrice) || 0) * seatsToDecrement,
        driverDepartureTime: driverDepartureTime || req.departureTime || '08:30',
        acceptedAt: new Date().toISOString()
      };
    }
    return req;
  });

  if (targetDriverId) {
    const updatedDrivers = drivers.map(d => {
      if (d.id === targetDriverId) {
        return { ...d, nbdisponibilite: Math.max(0, d.nbdisponibilite - seatsToDecrement) };
      }
      return d;
    });
    await saveTransporteursDB(updatedDrivers);
  }

  await saveRideRequestsDB(updatedRequests);
  return updatedRequests;
};

export const setFinalAgreedTimeDB = async (requestId, finalTime) => {
  const requests = getRideRequestsDB();
  const updatedRequests = requests.map(req => {
    if (req.id === requestId) return { ...req, finalAgreedTime: finalTime };
    return req;
  });
  await saveRideRequestsDB(updatedRequests);
  return updatedRequests;
};

export const cancelRideRequestDB = async (requestId) => {
  const requests = getRideRequestsDB();
  const drivers = getTransporteursDB();

  let targetDriverId = null;
  let seatsToRefund = 0;
  let wasAccepted = false;

  const updatedRequests = requests.map(req => {
    if (req.id === requestId) {
      targetDriverId = req.driverId;
      seatsToRefund = parseInt(req.requestedSeats) || 1;
      wasAccepted = req.status === 'accepted';
      return {
        ...req,
        status: 'cancelled',
        driverDecisionText: 'Décision : Course annulée par le client',
        cancelledAt: new Date().toISOString()
      };
    }
    return req;
  });

  if (targetDriverId && wasAccepted) {
    const updatedDrivers = drivers.map(d => {
      if (d.id === targetDriverId) {
        return { ...d, nbdisponibilite: d.nbdisponibilite + seatsToRefund };
      }
      return d;
    });
    await saveTransporteursDB(updatedDrivers);
  }

  await saveRideRequestsDB(updatedRequests);
  return updatedRequests;
};

// ============================================================
// BROADCAST CHANNEL (sync onglets même navigateur)
// ============================================================
export const subscribeToSync = (callback) => {
  const handler = (event) => callback(event?.data || event?.detail || event);
  const onStorage = (event) => {
    if (!event.key || event.key !== 'achaachaclo_sync_event_v3' || !event.newValue) return;
    try {
      callback(JSON.parse(event.newValue));
    } catch {
      callback(null);
    }
  };
  const onCustomEvent = (event) => callback(event.detail);

  channel.addEventListener('message', handler);
  window.addEventListener('storage', onStorage);
  window.addEventListener('achaachaclo_sync_custom', onCustomEvent);

  return () => {
    channel.removeEventListener('message', handler);
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('achaachaclo_sync_custom', onCustomEvent);
  };
};

// ============================================================
// FIREBASE STATUS
// ============================================================
export { isFirebaseConfigured };
