const PurchasedItems = require('../models/purchasedItems')

exports.createPurchasedItemForm = async (req, res, next) => {
    res.send(`
    <form action='/purchasedItems/${req.params.listingId}/${req.params.receiptId}' method=POST encType='multipart/form-data'>
    <input type="submit" value="Submit">
    </form>
    `)
}

exports.createPurchasedItem = async (req, res, next) => {
    let purchasedItem;
    try {
        purchasedItem = new PurchasedItems(req.params.listingId, req.params.receiptId)

        purchasedItem.save()
        res.status(200).json(purchasedItem)
    } catch (err) {
        console.log(err)
    }
}

exports.findPurchasedItemsByReceiptId = async (req, res, next) => {
    try {
        let [purchasedItems, _] = await PurchasedItems.findAllItemsByReceiptId(req.params.id);

        res.status(200).json(purchasedItems)
    } catch (err) {
        console.log(err)
    }
}