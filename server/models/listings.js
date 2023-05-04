const db = require('../config/db');
const getDate = require('./getDate')

class listing {
    constructor(name, description, collection, color, shape, price, saleAmount) {
        this.name = name;
        this.description = description;
        this.collection = collection,
        this.createdOn = null,
        this.price = price,
        this.inStock = true,
        this.color = color,
        this.shape = shape,
        this.saleAmount = saleAmount
    }

    async save() {
        this.createdOn = getDate()

        let sql = `
        INSERT INTO listings(name, description, collection, color, shape, price, sale_amount, in_stock, created_on)
        VALUES(
        "${this.name}", 
        "${this.description}", 
        ${this.collection}, 
        ${this.color}, 
        ${this.shape},  
        ${this.price}, 
        ${this.saleAmount}, 
        ${this.inStock}, 
        '${this.createdOn}'
        )
        `;

        return db.execute(sql)
    }

    static findAll() {
        let sql = `
        SELECT * FROM listings
        
        `

        return db.execute(sql)
    }

    static findAllByCollectionId(id) {
        let sql = `
        SELECT * FROM listings WHERE listings.collection = ${id}
        `

        return db.execute(sql)
    }

    static findById(id) {
        let sql = `SELECT * FROM listings WHERE listings.id = ${id}`

        return db.execute(sql)
    }
}

module.exports = listing