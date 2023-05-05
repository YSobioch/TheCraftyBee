const db = require('../config/db')
const User = require('./users')

const adminUser = async (userName, password) => {
    let user;
    try{
        [user, _] = await User.isUser(userName)
        const userPassword = Object.values(user[0])[0];
        
        return userPassword === password
    } catch (err) {
        console.log("admin user function:" + err)
        return false
    }
}

exports.updateById = async (table, columns, id, userName, password) => {
    let isAdmin = await adminUser(userName, password)
    if(!isAdmin) return

    let sql = `
    UPDATE ${table}
    SET ${columns}
    WHERE ${table}.id = ${id}
    `

    return db.execute(sql)
}

exports.deleteById = async (table, id, userName, password) => {
    let isAdmin = await adminUser(userName, password)
    if(!isAdmin) return

    let sql = `
    DELETE FROM ${table} WHERE ${table}.id = ${id}
    `

    return db.execute(sql)
}