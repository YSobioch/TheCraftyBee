const express = require('express');
const receiptController = require('../controllers/receiptController');
const router = express.Router()

router.route('/')
    .get(receiptController.createReceiptForm)
    .post(receiptController.createReceipt)

router.route('/ById/:id')
    .get(receiptController.getReciptById)

router.route('/ByOwnerId/:id')
    .get(receiptController.getAllReceiptsByOwnerId)

module.exports = router