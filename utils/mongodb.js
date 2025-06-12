const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('CRITICAL ERROR: MONGODB_URI environment variable is not set');
}

let clientPromise;

if (process.env.NODE_ENV === 'development') {
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
