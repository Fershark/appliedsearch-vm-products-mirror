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

    static getById(id) {
        return db.execute(`SELECT * FROM VMS WHERE id = ${id};`);
    }

    static addVM(params) {
        return db.execute(
            'INSERT INTO VMS (id, user_id) VALUES (?, ?)'
            ,
            [
                params.vm_id, params.user_id
            ]
        );
    }

    static deleteVM(id) {
        return db.execute(
            'DELETE FROM VMS WHERE id=? ;'
            ,[id]
        );
    }

    static updateIpV4(ipV4, id){
        return db.execute(
            'UPDATE VMS SET ipV4=? WHERE id=? ;'
            ,[ipV4, id]
        )
    }

    static checkOwner(user_id, vm_id){
        return db.execute(
            'SELECT EXISTS(SELECT * FROM VMS WHERE id=? AND user_id=?) as result;'
            ,[vm_id, user_id]
        )
    }

    static getVMSsummary(){
        return db.execute(
            `SELECT CONCAT('[', GROUP_CONCAT(CONCAT('{"', user_id, '-', id, '":"', ipV4, '"}') separator','), ']') as result from VMS;`
        )
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