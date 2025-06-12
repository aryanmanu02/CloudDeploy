const nextConnect = require('next-connect');
const clientPromise = require('../../../utils/mongodb');
const { ObjectId } = require('mongodb');

const handler = nextConnect();

handler.get(async (req, res) => {
  try {
    const client = await clientPromise;
    const products = await client.db('cruddb').collection('products').find().toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error('GET error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

handler.post(async (req, res) => {
  try {
    const client = await clientPromise;
    const result = await client.db('cruddb').collection('products').insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('POST error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = handler;
