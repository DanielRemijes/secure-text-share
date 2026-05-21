require('dotenv').config();
const express = require('express');
const { createClient } = require('redis');
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const client = createClient({ url: process.env.REDIS_URL });
client.connect();

client.on('error', (err) => console.log('Redis error:', err));

// POST - save text
app.post('/api/texts', async (req, res) => {
  const { text, duration } = req.body;
  if (!text || !duration) return res.status(400).json({ error: 'Missing text or duration' });

  const id = nanoid();
  await client.set(id, text, { EX: duration });
  res.json({ id });
});

// GET - retrieve text
app.get('/api/texts/:id', async (req, res) => {
  const text = await client.get(req.params.id);
  if (!text) return res.status(404).json({ error: 'Not found or expired' });
  res.json({ text });
});

// DELETE - delete text
app.delete('/api/texts/:id', async (req, res) => {
  await client.del(req.params.id);
  res.json({ message: 'Deleted' });
});

// Fallback to frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));