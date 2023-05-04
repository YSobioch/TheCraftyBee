const db = require('../config/db');

class ListingPicture {
    constructor(picture_owner_id, picture_id) {
        this.picture_owner_id = picture_owner_id,
        this.picture_id = picture_id
    }

    async save() {
        let sql = `INSERT INTO listing_pictures(picture_owner_id, picture_id) VALUES(${this.picture_owner_id}, ${this.picture_id})`
        return db.execute(sql)
    }

    static findAllPicturesByListingId(id) {
        let sql = `SELECT picture_id FROM listing_pictures WHERE listing_pictures.picture_owner_id = ${id}`
        return db.execute(sql)
    }
}

module.exports = ListingPicture