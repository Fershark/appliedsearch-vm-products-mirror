const db = require("../utils/database");
const { firebaseDB } = require('../utils/firebase');

module.exports = class User {
    constructor() {
        // any
    }

    static findAll() {
        return db.execute('SELECT * FROM users;');
    }

    static findUserByEmail(email) {
        return firebaseDB.collection("users").doc(email).get();
    }

    static saveUser(userDoc) {
        return firebaseDB.collection("users")
                            .doc(userDoc.email)
                            .set(userDoc);
    }
}