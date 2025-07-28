
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

function loadProducts() {
  if (!fs.existsSync(PRODUCTS_FILE)) return [];
  const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
  return JSON.parse(data || '[]');
}
function saveProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

router.post('/add', (req, res) => {
  const { name, price, image, sellerEmail } = req.body;

  const newProduct = {
    name,
    price,
    image,
    sellerEmail,
    status: "Pending"
  };

  const products = loadProducts();
  products.push(newProduct);
  saveProducts(products);

  res.json({ message: "Product submitted for admin review." });
});

router.get('/pending', (req, res) => {
  const products = loadProducts();
  const pending = products.filter(p => p.status === "Pending");
  res.json(pending);
});

router.post('/update-status', (req, res) => {
  const { index, status } = req.body;

  const products = loadProducts();
  const pending = products.filter(p => p.status === "Pending");

  if (pending[index]) {
    const originalIndex = products.findIndex(p => p.name === pending[index].name && p.status === "Pending");
    products[originalIndex].status = status;
    saveProducts(products);
    res.json({ message: `Product marked as ${status}` });
  } else {
    res.status(400).json({ message: 'Invalid product index' });
  }
});

router.get('/', (req, res) => {
  const products = loadProducts();
  const approved = products.filter(p => p.status === "Approved");
  res.json(approved);
});

module.exports = router;
