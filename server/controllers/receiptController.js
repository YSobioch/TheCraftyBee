const Receipt = require('../models/receipt')

exports.createReceipt = async (req, res, next) => {
    let receipt;
    try {
        receipt = new Receipt(req.body.total, req.body.receipt_owner_id);

        let [returnReceipt, _] = receipt.save();
        res.status(200).json(returnReceipt)
    } catch (err) {
        console.log(err)
    }
}

exports.getReciptById = async (req, res, next) => {
    try {
        let [receipt, _] = await Receipt.findReceiptById(id)

        //add the items here
        res.status(200).json()
    } catch (err) {
        console.log(err)
    }
}

exports.getAllReceiptsByOwnerId = async (req, res, next) => {
    try {
        let [receipts, _] = await Receipt.findAllReceiptsByOwnerId(id);

        //Add the items here
    } catch (err) {

    }
}