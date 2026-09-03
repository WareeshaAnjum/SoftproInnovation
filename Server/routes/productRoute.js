const express = require('express');
const routes= express.routes();
const Product = require('../models/Product');

// GET all products — storefront + admin table use this
routes.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// GET one product — for admin edit form / product detail page
routes.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

// POST — admin "Add Product"
routes.post('/products', async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// PUT — admin "Edit" (pencil icon)
routes.put('/products/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// DELETE — admin trash icon
routes.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = routes;