const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const methodOverride = require('method-override');
const path = require('path');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new sqlite3.Database(':memory:'); // Using in-memory database for simplicity
db.serialize(() => {
    db.run('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, description TEXT, date_created TEXT)');
    db.run('INSERT INTO items (name, description, date_created) VALUES ("Sample Item", "This is a sample item", DATE("now"))');
});

// Routes
// Fetch and display items on the main page
app.get('/', (req, res) => {
    const searchQuery = req.query.search || '';
    const query = `SELECT * FROM items WHERE name LIKE ? ORDER BY date_created DESC`;
    db.all(query, [`%${searchQuery}%`], (err, items) => {
        if (err) throw err;
        res.render('index', { items, searchQuery }); // Rendering the items on the page
    });
});

// Create a new item
app.post('/items', (req, res) => {
    const { name, description } = req.body;
    const query = 'INSERT INTO items (name, description, date_created) VALUES (?, ?, DATE("now"))';
    db.run(query, [name, description], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Update an existing item
app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const query = 'UPDATE items SET name = ?, description = ? WHERE id = ?';
    db.run(query, [name, description, id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Delete an item
app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM items WHERE id = ?';
    db.run(query, [id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
