import nextConnect from 'next-connect';
import clientPromise from '../../../utils/mongodb';

const handler = nextConnect();

handler.get(async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('cruddb');
    const products = await db.collection('products').find({}).toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error('GET error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

handler.post(async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('cruddb');
    const result = await db.collection('products').insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('POST error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

export default handler; // ✅ This is required for Next.js to recognize it as a valid API route
