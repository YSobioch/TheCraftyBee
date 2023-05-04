const db = require('../config/db')

class Collection {
    constructor(name, description, picture_id) {
        this.name = name;
        this.description = description;
        this.picture_id = picture_id
    }

    async save(){
        let sql = `
        INSERT INTO collections(name, description, picture_id) 
        VALUES ('${this.name}', '${this.description}', ${this.picture_id})`

        return db.execute(sql)        
    }

    static getAllCollections() {
        let sql = `
        SELECT * FROM collections`

        return db.execute(sql)
    }

    static getCollectionById(id) {
        let sql = `
        SELECT * FROM collections WHERE collections.id = ${id};`

        return db.execute(sql)
    }
}

module.exports = Collection