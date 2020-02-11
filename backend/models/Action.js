const db = require("../utils/database");

class Actions {

    constructor() {
        // any
    }

    //status:
    static STATUS_IN_PROGRESS() {return "in-progress"};
    static STATUS_ERRORED() {return "errored"};
    static STATUS_COMPLETED() {return "completed"};
    // static STATUS_ERRORED = "errored";
    // static STATUS_COMPLETED = "completed";



    static addAction(params) {
        return db.execute(
            'INSERT INTO ACTIONS (vm_id, type, status) VALUES (?, ?, ?)'
            ,
            [
                params.vm_id, params.type, params.status
            ]
        );
    }

    static updateActionStatus(action_id, status) {
        return db.execute(
            'UPDATE ACTIONS SET status = ? WHERE id = ?'
            ,
            [
                status, action_id
            ]
        );
    }

}

module.exports = Actions;
