const db = require('../config/db')

class PurchasedItems {
    constructor(item_id, receipt_id, price_paid) {
        this.item_id = item_id,
        this.receipt_id = receipt_id
        this.price_paid = price_paid
    }

    async save() {
        let sql = `
        INSERT INTO purchased_items(item_id, receipt_id, price_paid) 
        VALUES (${this.item_id}, ${this.receipt_id}, ${this.price_paid})
        `

        return db.execute(sql)
    }

    static findAllItemsByReceiptId(id) {
        let sql = `
        SELECT * FROM purchased_items WHERE purchased_items.receipt_id = ${id}
        `

        return db.execute(sql)
    }
}

module.exports = PurchasedItems