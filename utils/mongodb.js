import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI missing');

let clientPromise;
if (!global._mongoClient) {
  global._mongoClient = new MongoClient(uri).connect();
}
clientPromise = global._mongoClient;

export default clientPromise;
