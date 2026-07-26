export interface OfflineScan {
  id: string;
  image: string;
  timestamp: number;
  result?: any;
  synced: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface WeatherCache {
  id: 'current_weather';
  data: any;
  timestamp: number;
}

const DB_NAME = 'CropCareCoreDB';
const STORES = {
  SCANS: 'scans',
  CHAT: 'chat_history',
  WEATHER: 'weather_cache'
};

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2); // Version 2
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORES.SCANS)) {
        db.createObjectStore(STORES.SCANS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.CHAT)) {
        db.createObjectStore(STORES.CHAT, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.WEATHER)) {
        db.createObjectStore(STORES.WEATHER, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Generic DB Helpers
const performOp = async (storeName: string, mode: IDBTransactionMode, op: (store: IDBObjectStore) => IDBRequest) => {
  const db = await initDB();
  const tx = db.transaction(storeName, mode);
  const store = tx.objectStore(storeName);
  return new Promise((resolve, reject) => {
    const request = op(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Weather Cache
export const cacheWeather = (data: any) => 
  performOp(STORES.WEATHER, 'readwrite', (s) => s.put({ id: 'current_weather', data, timestamp: Date.now() }));

export const getCachedWeather = async (): Promise<WeatherCache | null> => 
  performOp(STORES.WEATHER, 'readonly', (s) => s.get('current_weather')) as Promise<WeatherCache>;

// Chat History
export const saveChatMessage = (msg: ChatMessage) => 
  performOp(STORES.CHAT, 'readwrite', (s) => s.put(msg));

export const getChatHistory = async (): Promise<ChatMessage[]> => 
  performOp(STORES.CHAT, 'readonly', (s) => s.getAll()) as Promise<ChatMessage[]>;

// Scan Management
export const saveScan = (scan: OfflineScan) => 
  performOp(STORES.SCANS, 'readwrite', (s) => s.put(scan));

export const getScans = async (): Promise<OfflineScan[]> => 
  performOp(STORES.SCANS, 'readonly', (s) => s.getAll()) as Promise<OfflineScan[]>;
