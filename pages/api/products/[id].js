import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../utils/mongodb';

const handler = nextConnect({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
  onError(err, req, res) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// CORS middleware
handler.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// OPTIONS handler for preflight
handler.options((req, res) => {
  res.status(200).end();
});

handler.put(async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('cruddb');
    const { id } = req.query;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated', result });
  } catch (error) {
    console.error('PUT error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

handler.delete(async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('cruddb');
    const { id } = req.query;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const result = await db.collection('products').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted', result });
  } catch (error) {
    console.error('DELETE error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default handler;
