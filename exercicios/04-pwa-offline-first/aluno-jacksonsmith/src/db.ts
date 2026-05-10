import Dexie from 'dexie';

export const db = new Dexie('AppDB');
db.version(1).stores({
  drafts: '++id, content, createdAt',
});
