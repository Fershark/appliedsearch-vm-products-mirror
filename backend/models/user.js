const db = require("../utils/database");

module.exports = class User {
    constructor() {
        // any
    }

    static findAll() {
        return db.execute('SELECT * FROM users;');
    }

    static findUserByEmail(email) {
    
    }

    static saveUser(params) {
        console.log("PARAMS ",params)
        return db.execute(
            'INSERT INTO USERS (name, email, phone, address) VALUES (?, ?, ?, ?)',
            [params.name, params.email, params.phone, params.address]
        );
    }

    static deleteUser(id) {

        return db.execute(
            'DELETE FROM USERS WHERE id = ?;',
            [id]
        );
    }
}