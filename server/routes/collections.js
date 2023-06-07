const express = require('express');
const router = express.Router();
const collections = require('../controllers/collectionsController')

router.route('/')
    .get(collections.getAllCollections)
    .post(collections.createNewCollection)

router.route('/updateCollection')
    .put(collections.updateCollectionById)


router.route('/:id')
    .get(collections.getCollectionById)
    .delete(collections.deleteCollectionById)

module.exports = router