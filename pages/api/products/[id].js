const nextConnect = require('next-connect');
const clientPromise = require('../../../utils/mongodb'); // adjust if not using alias

const handler = nextConnect();

handler.get(async (_, res) => {
  const client = await clientPromise;
  const products = await client.db('cruddb').collection('products').find().toArray();
  res.json(products);
});

handler.post(async (req, res) => {
  const client = await clientPromise;
  const result = await client.db('cruddb').collection('products').insertOne(req.body);
  res.status(201).json(result);
});

module.exports = handler;
