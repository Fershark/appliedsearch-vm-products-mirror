const db = require("../utils/database");

class VMs {
    constructor() {
        // any
    }

    // static findAll(item) {
    //     if (item == undefined) {
    //         return db.execute('SELECT i.* FROM items i ORDER BY i.id DESC;');
    //     } else {
    //         const searchPlacholder = '%__placeholder__%';
    //         const regex = /__placeholder__/gi;
    //         const itemSearch = searchPlacholder.replace(regex, item);
    //         return db.execute(
    //                 `SELECT i.* 
    //                 FROM items i 
    //                 WHERE i.name LIKE ?
    //                 ORDER BY i.id DESC;`,
    //                 [itemSearch]
    //             );
    //     }
        
    // }

    // static findByItemId(itemId) {
    //     return db.execute(
    //         `SELECT * FROM items i 
    //         WHERE i.id = ${itemId};`);
    // }

    static addVM(params) {
        return db.execute(
            'INSERT INTO VMS (id, user_id, config_details) VALUES (?, ?, ?)'
            ,
            [
                params.vm_id, params.user_id, JSON.stringify(params.config_details)
            ]
        );
    }

    // static editItem(params) {

    //     if(params.numberOfReview != null && params.averageRating != null){//add a review, 
    //         //then update item avg rating
    //         return db.execute(
    //             `UPDATE items SET numberOfReview = ?, averageRating = ? WHERE id = ?`,
    //             [
    //               params.numberOfReview, params.averageRating, params.id
    //             ]);
    //     }else{// add new item
    //         return db.execute(
    //             `UPDATE items SET ownerId = ?, name = ?, description = ?, \`condition\` = ?, category = ?, imageURLs = ?, tags = ?, lat = ?, lng = ?, price = ?, pickupAddress = ?
    //             WHERE id = ?`,
    //             [
    //               params.ownerId, params.name, params.description, params.condition, params.category,
    //               params.imageURLs, params.tags, params.lat, params.lng, params.price, params.pickupAddress, params.id
    //             ]);
    //     }
    // }

    // static findAllItemsOfUser(userId){
    //     return db.execute(
    //         `SELECT * FROM items i 
    //         WHERE i.ownerId = '${userId}' ORDER BY i.id DESC;`);
    // }

    // // AND endDate >= CURDATE()
    // static findWishlistOfUser(userId){
    //     return db.execute(`SELECT * FROM items WHERE id IN (
    //             SELECT itemId FROM wishlists WHERE ownerId = '${userId}'
    //             ) AND isActive = 1;`);
    // }
}

module.exports = VMs;