const db = require("../utils/database");

module.exports = class Product {
    constructor() {
        // any
    }

    //product status on a vm
    static STATUS_INSTALLING = () => "installing";
    static STATUS_UNSTALLING = () => "uninstalling";
    static STATUS_INSTALLED = () => "installed";
    static STATUS_ERRORED = () => "errored";

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