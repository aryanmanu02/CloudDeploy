const nextConnect = require('next-connect');
const clientPromise = require('../../../utils/mongodb');
const { ObjectId } = require('mongodb');

const handler = nextConnect();

handler.put(async (req, res) => {
  const client = await clientPromise;
  const { id } = req.query;
  await client.db('cruddb').collection('products').updateOne(
    { _id: new ObjectId(id) },
    { $set: req.body }
  );
  res.json({ success: true });
});

handler.delete(async (req, res) => {
  const client = await clientPromise;
  const { id } = req.query;
  await client.db('cruddb').collection('products').deleteOne(
    { _id: new ObjectId(id) }
  );
  res.json({ success: true });
});

module.exports = handler;
