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
  static TYPES = () => [this.TYPE_CREATE(), this.TYPE_INSTALL(), this.TYPE_UNINSTALL()];

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
        await connection.execute(`UPDATE VMS SET products = ? WHERE id = ?;`,
        [JSON.stringify(params.products), 
          params.vm_id]
        );

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
        await connection.execute(`UPDATE VMS SET products = ? WHERE id = ?;`,
        [JSON.stringify(params.products),
          params.vm_id
        ]);

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

  static getNewActions(){//get 10 new actions
    return db.execute(
      `select temp.vm, concat('[', group_concat(temp.action), ']') as actions from (select concat('{', '"id":"', VMS.id,'",' , '"user_id":"', VMS.user_id,'",' '"ipV4":"', VMS.ipV4,'"}') as vm, concat('{', '"id":"', ACTIONS.id,'",' , '"type":"', type,'",' '"product":', product, '}') as action from ACTIONS inner join VMS on ACTIONS.vm_id = VMS.id where status='new' order by ACTIONS.id limit 10) as temp group by temp.vm;`
    )
  }

}

module.exports = Actions;

// `select vm_id from (select vm_id, concat('{', '"id":"', id,'",' , 
// '"type":"', type,'",'
// '"product":', product, '}') as action from ACTIONS where status='new' order by id limit 10);
// `;

// ` select id as vm_id, concat('{"vm":{', '"id":"', id,'",' , 
// '"user_id":"', user_id,'",'
// '"ipV4":"', ipV4,'"}') as vm from VMS;
// `

// `select concat('{"vm":{', '"id":"', id,'",' , 
// '"user_id":"', user_id,'",'
// '"ipV4":"', ipV4,'"},', temp1.new_actions,'}') as result from VMS inner join
// (select temp.vm_id, concat('"actions":[' ,group_concat(temp.action),']') as new_actions from (select vm_id, concat('{', '"id":"', id,'",' , '"type":"', type,'",' '"product":', product, '}') as action from ACTIONS where status='new' order by id limit 10) as temp group by temp.vm_id) as temp1 on VMS.id = temp1.vm_id;`

// `select concat('[', group_concat(concat('{"vm":', temp1.vm, ',"actions":', temp1.actions, '}')), ']') as result from (select temp.vm, concat('[', group_concat(temp.action), ']') as actions from (select concat('{', '"id":"', VMS.id,'",' , 
// '"user_id":"', VMS.user_id,'",'
// '"ipV4":"', VMS.ipV4,'"}') as vm, concat('{', '"id":"', ACTIONS.id,'",' , '"type":"', type,'",' '"product":', product, '}') as action from ACTIONS inner join VMS on ACTIONS.vm_id = VMS.id where status='new' order by ACTIONS.id limit 10) as temp group by temp.vm) as temp1;`