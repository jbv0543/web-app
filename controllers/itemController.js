const db = require('../models/db');

// Get all items
exports.getAllItems = (req, res) => {
  db.all('SELECT * FROM items', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.render('index', { items: rows });
    }
  });
};

// Create a new item
exports.createItem = (req, res) => {
  const { name, description } = req.body;
  db.run('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.redirect('/items');
    }
  });
};

// Update an item
exports.updateItem = (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  db.run('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.redirect('/items');
    }
  });
};

// Partially update an item
exports.partialUpdateItem = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(updates), id];

  db.run(`UPDATE items SET ${fields} WHERE id = ?`, values, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.redirect('/items');
    }
  });
};

// Delete an item
exports.deleteItem = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM items WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.redirect('/items');
    }
  });
};
