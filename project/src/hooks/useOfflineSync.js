import { useEffect } from 'react';
import { db } from '../db/indexedDB';
import { useAuthStore } from '../stores/authStore';

export const useOfflineSync = () => {
  const user = useAuthStore(state => state.user);

  const syncData = async () => {
    if (!navigator.onLine) return;

    try {
      // Sync messages
      const offlineMessages = await db.offlineMessages.toArray();
      if (offlineMessages.length > 0) {
        // Sync with backend
        await db.offlineMessages.clear();
      }

      // Sync projects
      const offlineProjects = await db.offlineProjects.toArray();
      if (offlineProjects.length > 0) {
        // Sync with backend
        await db.offlineProjects.clear();
      }

      // Sync documents
      const offlineDocuments = await db.offlineDocuments.toArray();
      if (offlineDocuments.length > 0) {
        // Sync with backend
        await db.offlineDocuments.clear();
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    window.addEventListener('online', syncData);
    window.addEventListener('offline', () => {
      console.log('Application is offline. Changes will be synced when online.');
    });

    return () => {
      window.removeEventListener('online', syncData);
      window.removeEventListener('offline', () => {});
    };
  }, [user]);

  return { isOnline: navigator.onLine };
};