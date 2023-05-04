const db = require('../config/db');

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
            subscribed,
        ) VALUES (
            '
        )
        `
    }
}