const nextConnect = require('next-connect');
const clientPromise = require('../../../utils/mongodb');
const { ObjectId } = require('mongodb');

const handler = nextConnect({
  onError: (err, req, res) => {
    console.error('API route error:', err.stack || err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

handler.put(async (req, res) => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ 
        error: 'Configuration Error', 
        message: 'MONGODB_URI environment variable is not set' 
      });
    }
    
    const client = await clientPromise;
    const { id } = req.query;
    
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    await client.db('cruddb').collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('PUT product error:', error.stack || error);
    res.status(500).json({ 
      error: 'Database Error', 
      message: error.message || 'Failed to update product' 
    });
  }
});

handler.delete(async (req, res) => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ 
        error: 'Configuration Error', 
        message: 'MONGODB_URI environment variable is not set' 
      });
    }
    
    const client = await clientPromise;
    const { id } = req.query;
    
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    await client.db('cruddb').collection('products').deleteOne(
      { _id: new ObjectId(id) }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('DELETE product error:', error.stack || error);
    res.status(500).json({ 
      error: 'Database Error', 
      message: error.message || 'Failed to delete product' 
    });
  }
});

module.exports = handler;
