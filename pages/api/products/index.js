const nextConnect = require('next-connect');
const clientPromise = require('../../../utils/mongodb');

const handler = nextConnect();

handler.get(async (req, res) => {
  const client = await clientPromise;
  const products = await client.db('cruddb').collection('products').find().toArray();
  res.json(products);
});

handler.post(async (req, res) => {
  const client = await clientPromise;
  const result = await client.db('cruddb').collection('products').insertOne(req.body);
  res.status(201).json(result);
});

handler.put(async (req, res) => {
  const { id } = req.query;
  const client = await clientPromise;
  const result = await client.db('cruddb').collection('products').updateOne(
    { _id: new require('mongodb').ObjectId(id) },
    { $set: req.body }
  );
  res.status(200).json(result);
});

handler.delete(async (req, res) => {
  const { id } = req.query;
  const client = await clientPromise;
  const result = await client.db('cruddb').collection('products').deleteOne(
    { _id: new require('mongodb').ObjectId(id) }
  );
  res.status(200).json(result);
});

module.exports = handler;
