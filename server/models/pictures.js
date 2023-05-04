const db = require('../config/db');

class Pictures {
    constructor(name) {
        this.name = name
    }

    async save() {
        let sql = `INSERT INTO pictures(picture) VALUES('${this.name}');`
        return db.execute(sql)
    }

    static getPictureById(id) {
        let sql = `SELECT * FROM pictures WHERE pictures.id = ${id};`
        return db.execute(sql)
    }
}

module.exports = Pictures