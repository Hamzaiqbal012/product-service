const express = require('express');
const app = express();
app.use(express.json());

// In-memory product store (simulates a database for learning)
let products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'Desk Chair', price: 299.99, category: 'Furniture' },
  { id: 3, name: 'Coffee Mug', price: 14.99, category: 'Kitchen' },
];

let nextId = 4;

// Health check endpoint — Kubernetes will call this to know if your app is alive
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'product-service',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0'
  });
});

// Get all products
app.get('/products', (req, res) => {
  res.json({ success: true, count: products.length, data: products });
});

// Get one product
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
});

// Add a product
app.post('/products', (req, res) => {
  const { name, price, category } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ success: false, message: 'name, price, and category are required' });
  }
  const newProduct = { id: nextId++, name, price, category };
  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});