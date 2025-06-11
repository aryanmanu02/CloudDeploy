const nextConnectIndex = require('next-connect');
const clientPromiseIndex = require('@/utils/mongodb');

const handlerIndex = nextConnectIndex();

handlerIndex.get(async (_, res) => {
  const client = await clientPromiseIndex;
  const products = await client.db('cruddb').collection('products').find().toArray();
  res.json(products);
});

handlerIndex.post(async (req, res) => {
  const client = await clientPromiseIndex;
  const result = await client.db('cruddb').collection('products').insertOne(req.body);
  res.status(201).json(result);
});

module.exports = handlerIndex;