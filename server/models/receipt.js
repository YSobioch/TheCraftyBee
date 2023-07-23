const db = require('../config/db')
const date = require('./getDate')

class Receipt {
    constructor(total, receipt_owner_id, receipt_owner_email, payment_status) {
        this.name = "The Crafty Bee",              
        this.total = total,
        this.date,
        this.time,
        this.receipt_owner_id = receipt_owner_id,
        this.receipt_owner_email = receipt_owner_email,
        this.payment_status = payment_status
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
            receipt_owner,
            receipt_owner_email,
            payment_status
        ) VALUES (
            'The Crafty Bee',
            ${this.total},
            '${this.date}',
            '${this.time}',
            ${this.receipt_owner_id},
            '${this.receipt_owner_email}',
            '${this.payment_status}'
        )
        `

        return db.execute(sql)
    }

    static archiveListing(id, name, price, receiptId) {
        let sql = `INSERT INTO archived_listing(id, name, price, receipt_id) VALUES (${id}, '${name}', ${price}, ${receiptId})`

        return db.execute(sql)
    }

    static findReceiptById(id) {
        let sql = `
        SELECT * FROM receipts WHERE receipts.id = ${id}
        `

        return db.execute(sql);
    }

    static findAllReceiptsByOwnerId(id) {
        let sql = `
        SELECT * FROM receipts WHERE receipts.receipt_owner = ${id}
        `

        return db.execute(sql)
    }

    static findLastReceiptMadeForUser(email) {
        let sql = `
        SELECT * FROM receipts
        WHERE receipts.receipt_owner_email = '${email}'
        ORDER BY receipts.id DESC
        LIMIT 1
        `

        return db.execute(sql)
    }
}

module.exports = Receipt