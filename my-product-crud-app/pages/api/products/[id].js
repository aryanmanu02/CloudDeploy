import nextConnect from 'next-connect';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

const handler = nextConnect();

handler.put(async (req, res) => {
  const client = await clientPromise;
  const { id } = req.query;
  await client.db('cruddb').collection('products')
    .updateOne({ _id: new ObjectId(id) }, { $set: req.body });
  res.json({ success: true });
});

handler.delete(async (req, res) => {
  const client = await clientPromise;
  const { id } = req.query;
  await client.db('cruddb').collection('products')
    .deleteOne({ _id: new ObjectId(id) });
  res.json({ success: true });
});

export default handler;
