const db = require("../utils/database");

module.exports = class Product {
    constructor() {
        // any
    }

    static getAll() {
        return db.execute('SELECT * FROM PRODUCTS ORDER BY name;');
    }

    static getById(id) {
        return db.execute(
            'SELECT * FROM PRODUCTS WHERE id = ?;',
            [id]
        );
    }

}