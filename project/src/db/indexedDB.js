import Dexie from 'dexie';

export const db = new Dexie('DevCollabDB');

db.version(1).stores({
  offlineMessages: '++id, conversationId, content, timestamp, sender',
  offlineProjects: '++id, name, description, lastModified',
  offlineDocuments: '++id, title, content, lastModified',
  userPreferences: 'id, theme, language, notifications'
});