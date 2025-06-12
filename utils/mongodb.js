const { MongoClient } = require('mongodb');

// More robust error handling
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('CRITICAL ERROR: MONGODB_URI environment variable is not set');
  // Don't throw immediately - this allows the API to return a proper error
}

let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });
    global._mongoClientPromise = client.connect().catch(err => {
      console.error('MongoDB connection error:', err);
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, it's best to not use a global variable.
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 30000
  });
  clientPromise = client.connect().catch(err => {
    console.error('MongoDB connection error:', err);
    throw err;
  });
}

module.exports = clientPromise;
