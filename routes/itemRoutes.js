const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// GET all items
router.get('/', itemController.getAllItems);

// POST a new item
router.post('/', itemController.createItem);

// PUT to update an item
router.put('/:id', itemController.updateItem);

// PATCH to partially update an item
router.patch('/:id', itemController.partialUpdateItem);

// DELETE an item
router.delete('/:id', itemController.deleteItem);

module.exports = router;
