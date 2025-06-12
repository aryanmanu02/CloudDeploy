import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../utils/mongodb';

const handler = nextConnect();

handler.put(async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('cruddb');
    const { id } = req.query;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    res.status(200).json({ message: 'Updated', result });
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
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const result = await db.collection('products').deleteOne({
      _id: new ObjectId(id)
    });

    res.status(200).json({ message: 'Deleted', result });
  } catch (error) {
    console.error('DELETE error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default handler;
