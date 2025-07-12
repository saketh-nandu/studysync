// Local storage utilities for offline functionality
export class LocalStorage {
  private static getStorageKey(key: string): string {
    return `studysync_${key}`;
  }

  static setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.getStorageKey(key), serializedValue);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const serializedValue = localStorage.getItem(this.getStorageKey(key));
      if (serializedValue === null) return null;
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(this.getStorageKey(key));
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith("studysync_")) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }

  static getAllKeys(): string[] {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith("studysync_"))
        .map(key => key.replace("studysync_", ""));
    } catch (error) {
      console.error("Error getting localStorage keys:", error);
      return [];
    }
  }
}

// Session storage utilities for temporary data
export class SessionStorage {
  private static getStorageKey(key: string): string {
    return `studysync_session_${key}`;
  }

  static setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(this.getStorageKey(key), serializedValue);
    } catch (error) {
      console.error("Error saving to sessionStorage:", error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const serializedValue = sessionStorage.getItem(this.getStorageKey(key));
      if (serializedValue === null) return null;
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.error("Error reading from sessionStorage:", error);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      sessionStorage.removeItem(this.getStorageKey(key));
    } catch (error) {
      console.error("Error removing from sessionStorage:", error);
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith("studysync_session_")) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
    }
  }
}

// Offline data management
export class OfflineStorage {
  private static OFFLINE_QUEUE_KEY = "offline_queue";
  private static SYNC_STATUS_KEY = "sync_status";

  static addToOfflineQueue(request: {
    method: string;
    url: string;
    data?: any;
    timestamp: number;
  }): void {
    const queue = this.getOfflineQueue();
    queue.push(request);
    LocalStorage.setItem(this.OFFLINE_QUEUE_KEY, queue);
  }

  static getOfflineQueue(): any[] {
    return LocalStorage.getItem<any[]>(this.OFFLINE_QUEUE_KEY) || [];
  }

  static clearOfflineQueue(): void {
    LocalStorage.removeItem(this.OFFLINE_QUEUE_KEY);
  }

  static removeFromOfflineQueue(index: number): void {
    const queue = this.getOfflineQueue();
    queue.splice(index, 1);
    LocalStorage.setItem(this.OFFLINE_QUEUE_KEY, queue);
  }

  static setSyncStatus(status: "syncing" | "synced" | "error"): void {
    LocalStorage.setItem(this.SYNC_STATUS_KEY, {
      status,
      timestamp: Date.now(),
    });
  }

  static getSyncStatus(): { status: string; timestamp: number } | null {
    return LocalStorage.getItem<{ status: string; timestamp: number }>(this.SYNC_STATUS_KEY);
  }

  static isOnline(): boolean {
    return navigator.onLine;
  }

  static cacheData<T>(key: string, data: T, ttl: number = 3600000): void {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    LocalStorage.setItem(`cache_${key}`, cacheItem);
  }

  static getCachedData<T>(key: string): T | null {
    const cacheItem = LocalStorage.getItem<{
      data: T;
      timestamp: number;
      ttl: number;
    }>(`cache_${key}`);

    if (!cacheItem) return null;

    const now = Date.now();
    const isExpired = now - cacheItem.timestamp > cacheItem.ttl;

    if (isExpired) {
      LocalStorage.removeItem(`cache_${key}`);
      return null;
    }

    return cacheItem.data;
  }

  static clearExpiredCache(): void {
    const keys = LocalStorage.getAllKeys();
    const now = Date.now();

    keys.forEach(key => {
      if (key.startsWith("cache_")) {
        const cacheItem = LocalStorage.getItem<{
          data: any;
          timestamp: number;
          ttl: number;
        }>(key);

        if (cacheItem && now - cacheItem.timestamp > cacheItem.ttl) {
          LocalStorage.removeItem(key);
        }
      }
    });
  }
}

// Settings management
export class SettingsStorage {
  private static SETTINGS_KEY = "user_settings";

  static getSettings(): Record<string, any> {
    return LocalStorage.getItem<Record<string, any>>(this.SETTINGS_KEY) || {};
  }

  static setSetting(key: string, value: any): void {
    const settings = this.getSettings();
    settings[key] = value;
    LocalStorage.setItem(this.SETTINGS_KEY, settings);
  }

  static getSetting(key: string, defaultValue: any = null): any {
    const settings = this.getSettings();
    return settings[key] !== undefined ? settings[key] : defaultValue;
  }

  static removeSetting(key: string): void {
    const settings = this.getSettings();
    delete settings[key];
    LocalStorage.setItem(this.SETTINGS_KEY, settings);
  }

  static clearSettings(): void {
    LocalStorage.removeItem(this.SETTINGS_KEY);
  }
}
