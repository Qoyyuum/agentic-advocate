// IndexedDB Manager for Agentic Advocate Extension

const DB_NAME = 'AgenticAdvocateDB';
const DB_VERSION = 1;

// Database stores
const STORES = {
  DOCUMENTS: 'documents',
  CHAT_LOGS: 'chatLogs',
  FILE_INDICES: 'fileIndices',
  USER_CONFIG: 'userConfig',
  LEGAL_TEMPLATES: 'legalTemplates'
};

class DatabaseManager {
  constructor() {
    this.db = null;
  }

  // Initialize database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Database failed to open:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Database opened successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create documents store
        if (!db.objectStoreNames.contains(STORES.DOCUMENTS)) {
          const documentsStore = db.createObjectStore(STORES.DOCUMENTS, {
            keyPath: 'id',
            autoIncrement: true
          });
          documentsStore.createIndex('name', 'name', { unique: false });
          documentsStore.createIndex('type', 'type', { unique: false });
          documentsStore.createIndex('timestamp', 'timestamp', { unique: false });
          documentsStore.createIndex('category', 'category', { unique: false });
        }

        // Create chat logs store
        if (!db.objectStoreNames.contains(STORES.CHAT_LOGS)) {
          const chatLogsStore = db.createObjectStore(STORES.CHAT_LOGS, {
            keyPath: 'id',
            autoIncrement: true
          });
          chatLogsStore.createIndex('timestamp', 'timestamp', { unique: false });
          chatLogsStore.createIndex('type', 'type', { unique: false });
        }

        // Create file indices store
        if (!db.objectStoreNames.contains(STORES.FILE_INDICES)) {
          const fileIndicesStore = db.createObjectStore(STORES.FILE_INDICES, {
            keyPath: 'id',
            autoIncrement: true
          });
          fileIndicesStore.createIndex('keyword', 'keyword', { unique: false });
          fileIndicesStore.createIndex('documentId', 'documentId', { unique: false });
        }

        // Create user config store
        if (!db.objectStoreNames.contains(STORES.USER_CONFIG)) {
          db.createObjectStore(STORES.USER_CONFIG, {
            keyPath: 'key'
          });
        }

        // Create legal templates store
        if (!db.objectStoreNames.contains(STORES.LEGAL_TEMPLATES)) {
          const templatesStore = db.createObjectStore(STORES.LEGAL_TEMPLATES, {
            keyPath: 'id',
            autoIncrement: true
          });
          templatesStore.createIndex('category', 'category', { unique: false });
          templatesStore.createIndex('name', 'name', { unique: false });
        }

        console.log('Database schema created');
      };
    });
  }

  // Add document
  async addDocument(document) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.DOCUMENTS], 'readwrite');
      const store = transaction.objectStore(STORES.DOCUMENTS);

      const documentData = {
        ...document,
        timestamp: Date.now()
      };

      const request = store.add(documentData);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Get document by ID
  async getDocument(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.DOCUMENTS], 'readonly');
      const store = transaction.objectStore(STORES.DOCUMENTS);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Get all documents
  async getAllDocuments(limit = 100) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.DOCUMENTS], 'readonly');
      const store = transaction.objectStore(STORES.DOCUMENTS);
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev');

      const documents = [];
      let count = 0;

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && count < limit) {
          documents.push(cursor.value);
          count++;
          cursor.continue();
        } else {
          resolve(documents);
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Search documents by keyword
  async searchDocuments(keyword) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.DOCUMENTS], 'readonly');
      const store = transaction.objectStore(STORES.DOCUMENTS);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result.filter(doc => {
          const searchText = `${doc.name} ${doc.content} ${doc.category}`.toLowerCase();
          return searchText.includes(keyword.toLowerCase());
        });
        resolve(results);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Delete document
  async deleteDocument(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.DOCUMENTS], 'readwrite');
      const store = transaction.objectStore(STORES.DOCUMENTS);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Add chat log
  async addChatLog(message, type, metadata = {}) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.CHAT_LOGS], 'readwrite');
      const store = transaction.objectStore(STORES.CHAT_LOGS);

      const logData = {
        message,
        type,
        metadata,
        timestamp: Date.now()
      };

      const request = store.add(logData);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Get chat logs
  async getChatLogs(limit = 50) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.CHAT_LOGS], 'readonly');
      const store = transaction.objectStore(STORES.CHAT_LOGS);
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev');

      const logs = [];
      let count = 0;

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && count < limit) {
          logs.push(cursor.value);
          count++;
          cursor.continue();
        } else {
          resolve(logs.reverse());
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Save user config
  async saveConfig(key, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.USER_CONFIG], 'readwrite');
      const store = transaction.objectStore(STORES.USER_CONFIG);

      const request = store.put({ key, value, timestamp: Date.now() });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Get user config
  async getConfig(key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.USER_CONFIG], 'readonly');
      const store = transaction.objectStore(STORES.USER_CONFIG);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result ? request.result.value : null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Add legal template
  async addTemplate(template) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.LEGAL_TEMPLATES], 'readwrite');
      const store = transaction.objectStore(STORES.LEGAL_TEMPLATES);

      const request = store.add({
        ...template,
        timestamp: Date.now()
      });

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Get templates by category
  async getTemplatesByCategory(category) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.LEGAL_TEMPLATES], 'readonly');
      const store = transaction.objectStore(STORES.LEGAL_TEMPLATES);
      const index = store.index('category');
      const request = index.getAll(category);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Clear all data (for testing or reset)
  async clearAllData() {
    const stores = Object.values(STORES);
    const promises = stores.map(storeName => {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    return Promise.all(promises);
  }
}

// Export singleton instance
const dbManager = new DatabaseManager();

// Auto-initialize on load
if (typeof window !== 'undefined') {
  dbManager.init().catch(console.error);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { dbManager, DatabaseManager, STORES };
}
