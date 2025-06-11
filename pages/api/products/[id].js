const nextConnectId = require('next-connect');
const clientPromiseId = require('@/utils/mongodb');
const { ObjectId } = require('mongodb');

const handlerId = nextConnectId();

handlerId.put(async (req, res) => {
  const client = await clientPromiseId;
  const { id } = req.query;
  await client.db('cruddb').collection('products')
    .updateOne({ _id: new ObjectId(id) }, { $set: req.body });
  res.json({ success: true });
});

handlerId.delete(async (req, res) => {
  const client = await clientPromiseId;
  const { id } = req.query;
  await client.db('cruddb').collection('products')
    .deleteOne({ _id: new ObjectId(id) });
  res.json({ success: true });
});

module.exports = handlerId;