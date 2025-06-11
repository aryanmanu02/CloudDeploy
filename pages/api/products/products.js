let products = []; // In-memory storage for demo
let id = 1; // Simple auto-increment ID for demo

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(products);
  } else if (req.method === 'POST') {
    const newProduct = { ...req.body, _id: id++ };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const index = products.findIndex(p => p._id == id);
    if (index >= 0) {
      products[index] = { ...products[index], ...req.body };
      res.status(200).json(products[index]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    products = products.filter(p => p._id != id);
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}
