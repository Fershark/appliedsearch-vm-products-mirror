const db = require("../utils/database");

module.exports = class User {
    constructor() {
        // any
    }

    static findAll() {
        return db.execute('SELECT * FROM users;');
    }

    static findUserById(id) {
        return db.execute(
            'SELECT * FROM USERS WHERE id = ?;',
            [id]
        );
    }

    static saveUser(params) {
        // console.log("PARAMS ",params)
        return db.execute(
            'INSERT INTO USERS (name, email, phone, address) VALUES (?, ?, ?, ?)',
            [params.name, params.email, params.phone, params.address]
        );
    }

    static updateUser(params) {
        return db.execute(
            'UPDATE USERS SET name=? , phone=? , address=? WHERE id=? ;',
            [params.name, params.phone, params.address, params.id]
        );
    }

    static deleteUser(id) {

        return db.execute(
            'DELETE FROM USERS WHERE id = ?;',
            [id]
        );
    }
}