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
}

module.exports = listing