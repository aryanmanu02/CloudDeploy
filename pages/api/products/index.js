// pages/api/products/index.js
import nextConnect from 'next-connect';
import clientPromise from '../../../utils/mongodb';

const handler = nextConnect();

handler.get(async (req, res) => {
  try {
    const client = await clientPromise;
    const products = await client.db('cruddb').collection('products').find().toArray();
    res.json(products);
  } catch (error) {
    console.error('GET Error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

handler.post(async (req, res) => {
  try {
    const client = await clientPromise;
    const result = await client.db('cruddb').collection('products').insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('POST Error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

export default handler; // <-- Only export handler
