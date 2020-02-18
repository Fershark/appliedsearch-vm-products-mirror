const db = require("../utils/database");
const Product = require("../models/Product");

class Actions {

  constructor() {
    // any
  }

  //status:
  static STATUS_NEW = () => "new";
  static STATUS_IN_PROGRESS = () => "in-progress";
  static STATUS_ERRORED = () => "errored";
  static STATUS_COMPLETED = () => "completed";
  
  //type
  //status:
  static TYPE_CREATE = () => "create";
  static TYPE_INSTALL = () => "install";
  static TYPE_UNINSTALL = () => "uninstall";

  static getById(id) {
    return db.execute( 'SELECT * FROM ACTIONS WHERE id = ?',
      [ id ] );
  }

  static async addAction(params) {

    let connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      
      //Add action to ACTIONS table
      let result = await connection.execute(
        'INSERT INTO ACTIONS (vm_id, type, status, product) VALUES (?, ?, ?, ?)',
        [
          params.vm_id, params.type, params.status, params.product == undefined ? null : params.product
        ]
      );

      //Update VMS table if needed
      if(params.products)
        await connection.execute(`UPDATE VMS SET products = '${JSON.stringify(params.products)}' WHERE id=${params.vm_id};`);

      await connection.commit();
      return result;
    } catch (err) {

      await connection.rollback();
      // Throw the error again so others can catch it.
      throw err;

    } finally {

      connection.release();

    }
  }

  static async updateAction(params) {

    let connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      
      //Update ACTIONS table
      let result = await connection.execute(
        'UPDATE ACTIONS SET status = ? WHERE id=?;',
        [ params.status, params.id ]
      );

      //Update VMS table if needed
      if(params.products)
        await connection.execute(`UPDATE VMS SET products = '${JSON.stringify(params.products)}' WHERE id=${params.vm_id};`);

      await connection.commit();
      return result;
    } catch (err) {

      await connection.rollback();
      // Throw the error again so others can catch it.
      throw err;

    } finally {

      connection.release();

    }
  }

  static updateActionStatus(action_id, status) {
    return db.execute(
      'UPDATE ACTIONS SET status = ? WHERE id = ?',
      [
        status, action_id
      ]
    );
  }

  static checkBusyVM(vm_id) { //true if there is "in-progess" action
    return db.execute(
      'SELECT EXISTS(SELECT * FROM ACTIONS WHERE vm_id=? AND status=?) as result;', [vm_id, this.STATUS_IN_PROGRESS()]
    )
  }

}

module.exports = Actions;