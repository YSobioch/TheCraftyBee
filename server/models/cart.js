const db = require('../config/db')

class Cart {
    constructor(cart_owner_id, listing_id) {
        this.cart_owner_id = cart_owner_id,
        this.listing_id = listing_id
    }

    async save() {
        let sql = `
        INSERT INTO cart (cart_owner_id, listing_id)
        VALUES (${this.cart_owner_id}, ${this.listing_id})
        `

        return db.execute(sql);
    }

    static empty(id) {
        let sql = `
        DELETE FROM cart WHERE cart.cart_owner_id = ${id}
        `

        return db.execute(sql)
    }

    static getAllCartsByCartOwnerId(userId) {
        let sql = `
        SELECT * FROM cart WHERE cart.cart_owner_id = ${userId}
        `

        return db.execute(sql)
    }

    static getCartById(id) {
        let sql = `
        SELECT * FROM cart WHERE cart.id = ${id}
        `

        return db.execute(sql)
    }

    static findItemsInCartByUserId(id) {
        let sql = `
        SELECT listings.id, listings.name, listings.price, listings.sale_amount FROM users
        INNER JOIN cart ON cart.cart_owner_id = users.id
        INNER JOIN listings ON listings.id = cart.listing_id
        WHERE users.id = ${id}
        `

        return db.execute(sql)
    }
}

module.exports = Cart