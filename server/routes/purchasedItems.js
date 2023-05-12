const express = require('express');
const purchasedItemController = require('../controllers/purchasedItemsController');
const router = express.Router()


router.route('/findBy/:id')
    .get(purchasedItemController.findPurchasedItemsByReceiptId)

router.route('/:listingId/:receiptId')
    .get(purchasedItemController.createPurchasedItemForm)
    .post(purchasedItemController.createPurchasedItem)

module.exports = router