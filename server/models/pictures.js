const db = require('../config/db');

class Pictures {
    constructor(name) {
        this.name = name
    }

    async save() {
        let sql = `INSERT INTO pictures(picture) VALUES('${this.name}');`
        return db.execute(sql)
    }

    static getAllPictures() {
        let sql = `SELECT * FROM pictures`
        return db.execute(sql)
    }

    static getPictureById(id) {
        let sql = `SELECT * FROM pictures WHERE pictures.id = ${id};`
        return db.execute(sql)
    }

    static updatePictureByName(oldName, newName) {
        let sql = `
        UPDATE pictures
        picture = '${newName}'
        WHERE pictures.picture = ${oldName}
        `

        return db.execute(sql)
    }

    static deletePictureByName(name) {
        let sql = `
        DELETE FROM pictures WHERE pictures.picture = '${name}'
        `

        return db.execute(sql)
    }
}

module.exports = Pictures