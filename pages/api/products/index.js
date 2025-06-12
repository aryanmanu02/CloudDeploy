const nextConnect = require('next-connect');
const clientPromise = require('../../../utils/mongodb');

const handler = nextConnect({
  onError: (err, req, res) => {
    console.error('API route error:', err.stack || err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

handler.get(async (req, res) => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ 
        error: 'Configuration Error', 
        message: 'MONGODB_URI environment variable is not set' 
      });
    }
    
    const client = await clientPromise;
    const products = await client.db('cruddb').collection('products').find().toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error('GET products error:', error.stack || error);
    res.status(500).json({ 
      error: 'Database Error', 
      message: error.message || 'Failed to fetch products' 
    });
  }
});

handler.post(async (req, res) => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ 
        error: 'Configuration Error', 
        message: 'MONGODB_URI environment variable is not set' 
      });
    }
    
    const client = await clientPromise;
    const result = await client.db('cruddb').collection('products').insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('POST product error:', error.stack || error);
    res.status(500).json({ 
      error: 'Database Error', 
      message: error.message || 'Failed to create product' 
    });
  }
});

module.exports = handler;
