const Receipt = require('../models/receipt')
const Cart = require('../models/cart')
const Listing = require('../models/listings')
const PurchasedItems = require('../models/purchasedItems')



exports.createReceiptForm = async (req, res, next) => {
    try {
        res.send(`
        <form action='/receipts' method='POST' encType='multipart/form-data'>
        <input type='number' name='userId'>
        <input type='submit' value='Submit'>
        </form>
        `)
    } catch (err) {
        console.log(err)
    }
}

exports.createReceipt = async (req, res, next) => {
    let receipt;
    let purchasedItems = []
    let total;
    let userId = req.body.userId
    try {
        let [listingData, _] = await Cart.findItemsInCartByUserId(userId)
        total = getTotal(listingData);
        receipt = new Receipt(total, userId)
        await receipt.save()

        let createdReceipt = await Receipt.findLastReceiptMadeForUser(userId)
        createdReceipt = await createdReceipt[0][0]

        await listingData.forEach(listing => {
            let purchasedItem = new PurchasedItems(listing.id, createdReceipt.id, listing.price)
            purchasedItems.push(purchasedItem);
            purchasedItem.save()
        })

        await Cart.empty(userId)

        createdReceipt.items = purchasedItems
        res.json(createdReceipt)
    } catch (err) {
        console.log(err)
    }
}

exports.getReciptById = async (req, res, next) => {
    let id = req.params.id
    try {
        let [receipt, _] = await Receipt.findReceiptById(id)
        receipt = receipt[0]

        let purchasedItems = await PurchasedItems.findAllItemsByReceiptId(id)
        purchasedItems = purchasedItems[0]
        receipt.items = purchasedItems
        res.status(200).json(receipt)
    } catch (err) {
        console.log(err)
    }
}

exports.getAllReceiptsByOwnerId = async (req, res, next) => {
    let id = req.params.id
    try {
        let [receipts, _] = await Receipt.findAllReceiptsByOwnerId(id);

        res.status(200).json(receipts)
    } catch (err) {

    }
}

const getTotal = (listingArr) => {
    let total = 0;
    listingArr.forEach(listing => {
        total += (listing.price - (listing.price * listing.sale_amount))
    })

    return total
}