const db = require('../config/db')
const date = require('./getDate')

class Receipt {
    constructor(total, receipt_owner_id) {
        this.name = "The Crafty Bee",              
        this.total = total,
        this.date,
        this.time,
        this.receipt_owner_id = receipt_owner_id
    }

    async save() {
        this.date = date.getDate()
        this.time = date.getTime()

        let sql = `
        INSERT INTO receipts(
            name,
            total,
            date,
            time,
            receipt_owner
        ) VALUES (
            "The Crafty Bee",
            '${this.total}',
            '${this.date}',
            '${this.time}',
            ${this.receipt_owner_id}
        )
        `

        return db.execute(sql)
    }

    static findReceiptById(id) {
        let sql = `
        SELECT * FROM receipts WHERE receipts.id = ${id}
        `

        db.execute(sql);
    }

    static findAllReceiptsByOwnerId(id) {
        let sql = `
        SELECT * FROM receipts WHERE receipts.receipt_owner = ${id}
        `

        db.execute(sql)
    }
}

module.exports = Receipt