const db = require('../config/db');
require("dotenv").config();

class User {
    constructor(username, password, email, subscribed) {
        this.username = username,
        this.password = password,
        this.email = email,
        this.subscribed = subscribed
    }

    async save() {
        let sql = `
        INSERT INTO users(
            username,
            password,
            email,
            admin,
            subscribed
        ) VALUES (
            '${this.username}',
            aes_encrypt('${this.password}', '${process.env.DB_KEY}'),
            '${this.email}',
            false,
            ${this.subscribed}
        )
        `

        return db.execute(sql);
    }

    static update(id, username, password, email, subscribed) {
        let sql = `
        UPDATE users
        SET username = '${username}', password = aes_encrypt('${password}', '${process.env.DB_KEY}'), email = '${email}', subscribed = ${subscribed}
        WHERE id = ${id}
        `

        return db.execute(sql)
    }

    static deleteUser(id) {
        let sql= `
        DELETE FROM users WHERE users.id = ${id}
        `

        return db.execute(sql)
    }

    static findAllUsers(optionalWhere = '') {
        let sql = `
        SELECT id, username, email FROM users ${optionalWhere}
        `

        return db.execute(sql)
    }

    static findUserByEmail(email) {
        let sql = `
        SELECT * FROM users WHERE users.email = '${email}'
        `

        return db.execute(sql)
    }
    
    static isUser(email) {
        let sql = `SELECT cast(aes_decrypt(password, '${process.env.DB_KEY}') AS char) FROM users WHERE users.email = '${email}'`;

        return db.execute(sql)
    }
}

module.exports = User