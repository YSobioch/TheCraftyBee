const db = require('../config/db')

class ColorsAndShapes {
    constructor(name) {
        this.name = name;
    }

    static getColor() {
        let sql = `
        SELECT * FROM color
        `

        return db.execute(sql)
    }

    static getShape() {
        let sql = `
        SELECT * FROM shape
        `

        return db.execute(sql)
    }

    async saveColor() {
        let sql = `
        INSERT INTO color(color)
        VALUES('${this.name}')
        `

        return db.execute(sql)
    }

    async saveShape() {
        let sql = `
        INSERT INTO shape(shape)
        VALUES('${this.name}')
        `

        return db.execute(sql)
    }

    static updateShape(id, value) {
        let sql = `
        UPDATE shape
        SET shape = '${value}'
        WHERE shape.id = ${id}
        `

        return db.execute(sql)
    }

    static updateColor(id, value) {
        let sql = `
        UPDATE color
        SET color = '${value}'
        WHERE color.id = ${id}
        `

        return db.execute(sql)
    }

    static deleteColor(id) {
        let sql = `
        DELETE FROM color 
        WHERE color.id = ${id}
        `

        return db.execute(sql)
    }

    static deleteShape(id) {
        let sql = `
        DELETE FROM shape 
        WHERE shape.id = ${id}
        `

        return db.execute(sql)
    }
}

module.exports = ColorsAndShapes