const db = require('../config/db')
const User = require('./users')

const adminUser = async (email, password) => {
    let user;
    try{
        [user, _] = await User.isUser(email)
        const userPassword = Object.values(user[0])[0];

        return userPassword === password
    } catch (err) {
        console.log("admin user function:" + err)
        return false
    }
}

exports.updateUserById = async (columns, email, password) => {
    let isAdmin = await adminUser(email, password)
    if(!isAdmin) return

    let [user, _] = await User.findUserByEmail(email);
    user = user[0]

    let sql = `
    UPDATE users
    SET ${columns}
    WHERE users.id = ${user.id}
    `

    return db.execute(sql)
}

exports.deleteUserById = async (userName, password) => {
    let isAdmin = await adminUser(userName, password)
    if(!isAdmin) return

    let [user, _] = await User.findUserByUsername(userName);
    user = user[0]

    let sql = `
    DELETE FROM users WHERE users.id = ${user.id}
    `

    return db.execute(sql)
}

exports.updateById = async (table, columns, id) => {
    let sql = `
    UPDATE ${table}
    SET ${columns}
    WHERE ${table}.id = ${id}
    `

    return db.execute(sql)
}

exports.deleteById = async (table, id) => {
    let sql = `
    DELETE FROM ${table} WHERE ${table}.id = ${id}
    `

    return db.execute(sql)
}