import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image: '' });
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    const res = await fetch('/api/products');
    setProducts(await res.json());
  }

  async function uploadImage() {
    if (!file) return form.image;
    const data = new FormData();
    data.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: data });
    if (!res.ok) throw new Error('Image upload failed');
    return (await res.json()).url;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrl = await uploadImage();
      const payload = { name: form.name, price: form.price, image: imageUrl };

      if (editId) {
        await fetch(`/api/products/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setForm({ name: '', price: '', image: '' });
      setFile(null);
      setEditId(null);
      await fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  }

  function handleEdit(product) {
    setForm({ name: product.name, price: product.price, image: product.image });
    setEditId(product._id);
  }

  function handleFileChange(e) {
    setFile(e.target.files?.[0] || null);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Product Manager</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
            {(form.image || file) && (
              <img
                src={file ? URL.createObjectURL(file) : form.image}
                alt="Preview"
                className="w-24 h-24 mt-2 object-cover rounded"
              />
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
          </button>
        </form>

        <h2 className="text-xl font-semibold mb-4">
          {products.length} Products
        </h2>

        <div className="space-y-4">
          {products.map(product => (
            <div
              key={product._id}
              className="border p-4 rounded bg-gray-50 flex justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-bold">{product.name}</p>
                  <p className="text-blue-700 font-semibold">${product.price}</p>
                </div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="text-sm px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
