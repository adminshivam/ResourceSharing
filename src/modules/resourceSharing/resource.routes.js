const express = require('express');
const ResourceManager = require('./resource.controller');

const router = express.Router();

// Route to create a new resource.
router.post('/', ResourceManager.createResource);

// Route to get all resources for logged in user.
router.get('/', ResourceManager.getResources);

// Route to get a resource by id.
router.get('/:id', ResourceManager.getResource);

// Route to delete a resource.
router.delete('/:id', ResourceManager.deleteResource);

module.exports = router;
