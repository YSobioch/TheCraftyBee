const db = require('../config/db');
const getDate = require('./getDate')
const date = getDate.getDate

class listing {
    constructor(name, description, description_long, collection, color, shape, price, saleAmount) {
        this.name = name;
        this.description = description,
        this.description_long = description_long,
        this.collection = collection,
        this.createdOn = null,
        this.price = price,
        this.inStock = true,
        this.color = color,
        this.shape = shape,
        this.saleAmount = saleAmount
    }

    async save() {
        this.createdOn = date()

        let sql = `
        INSERT INTO listings(name, description, description_long, collection, color, shape, price, sale_amount, in_stock, created_on)
        VALUES(
        "${this.name}", 
        "${this.description}", 
        "${this.description_long}",
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

    static getNewestListingId() {
        let sql = `SELECT id FROM listings ORDER BY listings.id DESC LIMIT 1`

        return db.execute(sql)
    }

    static updateListing(id, name, description, description_long, collection, color, shape, price, saleAmount) {
        let sql = `
        UPDATE listings
        SET listings.name = "${name}", listings.description = "${description}", listings.description_long = "${description_long}", listings.collection = ${collection}, listings.color = ${color}, listings.shape = ${shape}, listings.price = ${price}, listings.sale_amount = ${saleAmount}
        WHERE listings.id = ${id}
        `

        return db.execute(sql)
    }

    static deleteListing(id) {
        let sql = `DELETE FROM listings WHERE listings.id = ${id}`

        return db.execute(sql)
    }

    static findAll() {
        let sql = `
        SELECT * FROM listings     
        `

        return db.execute(sql)
    }

    static findAllByCollectionId(collectionId, shapesArr, colorArr) {
        let collectionOption = ``
        let shapesOption = []
        let colorsOption = []
        let completedQuery = []


        if(collectionId !== "null") collectionOption = `listings.collection = ${collectionId}`

        if(typeof shapesArr !== "undefined") {
            if(typeof shapesArr === 'string') {
                shapesOption.push(`shape = ${shapesArr}`)
            } else {

                for(let id of shapesArr) {
                    shapesOption.push(`shape = ${id}`)
                }
            }
        }

        if(typeof colorArr !== "undefined") {
            if(typeof colorArr === 'string') {
                colorsOption.push(`color = ${colorArr}`)
            } else {
                for(let id of colorArr) {
                    colorsOption.push(`color = ${id}`)
                }
            }
        }


        let workingQuery = [`(${collectionOption})`, `(${shapesOption.join(' OR ')})`, `(${colorsOption.join(' OR ')})`]

        for(let str of workingQuery) {
            if(str.length === 2) continue;
            completedQuery.push(str)
        }
        completedQuery = completedQuery.join(" AND ")

        if(completedQuery.length) completedQuery = " WHERE " + completedQuery
        let sql = 'SELECT * FROM listings' + completedQuery

        return db.execute(sql)
    }

    static findById(id) {
        let sql = `SELECT * FROM listings WHERE listings.id = ${id}`

        return db.execute(sql)
    }

    static findMultipleById(arr) {
        let sql = `SELECT * FROM listings WHERE listings.id = ${arr[0]}`
        for(let i = 1; i < arr.length; i++) {
            let id = arr[i]
            sql += ` OR listings.id = ${id}`
        }

        return db.execute(sql)
    }

}

module.exports = listing