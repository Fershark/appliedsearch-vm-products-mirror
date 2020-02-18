// place the users logic here
const Action = require('../models/Action');
const Product = require('../models/Product');
const VM = require('../models/VM')
const authorize = require('../utils/authorize');

exports._create = async (action) => {

	//check vm_id and type
	if (!action.vm_id || !action.type) {
		throw new Error('vm_id and type are required');
	}

	//check product info
	if ((action.type == Action.TYPE_UNINSTALL() ||
			action.type == Action.TYPE_INSTALL()) && !action.product) {
		throw new Error('Product is required');
	}

	if (action.product) { //get product info from db
		let productResult = await Product.getById(action.product);

		if (productResult[0][0] == undefined) {
			throw new Error('Product does not exist');
		}
		action.product = {
			"id": productResult[0][0].id,
			"name": productResult[0][0].name,
			"description": productResult[0][0].description,
			"version": productResult[0][0].version
		};

		//check VMS.products => can add action or not
		//get products info
		let productsResult = await VM.getProducts(action.vm_id);
		let products = productsResult[0][0].products;

		console.log(products);

		switch (action.type) { //install or uninstall
			case Action.TYPE_INSTALL():
				//allow INSTALL, when not installed or install errored 
				if (!products[action.product.id] || products[action.product.id].status == Product.STATUS_ERRORED()) {
					products[action.product.id] = {
						"status": Product.STATUS_INSTALLING(),
						"name": action.product.name,
						"description": action.product.description,
						"version": action.product.version
					}
				} else {
					throw new Error('Invalid Request! Product has status ' +
						products[action.product.id].status);
				}
				break;
			case Action.TYPE_UNINSTALL():
				//allow UNINSTALL, when product was installed
				if (typeof products[action.product.id] != "undefined" &&
					(products[action.product.id].status == Product.STATUS_INSTALLED() ||
						products[action.product.id].status == Product.STATUS_ERRORED())) {
					products[action.product.id].status = Product.STATUS_UNSTALLING();
				} else {
					throw new Error('Invalid Request! Product has not been installed successfully or is uninstalling');
				}
				break;
		}
		action.products = products;
	}

	// ACTION is created has 2 types of status
	// 1. in-progress: actions for DO 
	// 2. new: actions for our app (types: install/uninstall)
	if (action.product)
		action.status = Action.STATUS_NEW();
	else
		action.status = Action.STATUS_IN_PROGRESS();

	console.log(action);
	return await Action.addAction(action);
}

exports.create = async (req, res, next) => {
	console.log("create an action");

	try {
		//1. user is vm's owner
		await authorize.checkOwnership(req.user.id, req.body.vm_id);

		let result = await this._create(req.body);

		if (result[0].affectedRows == 1) { // action is added

			let newAction = await Action.getById(result[0].insertId);
			let products = await VM.getProducts(newAction[0][0].vm_id);

			res.status(200).json({
				"message": "Action Added!",
				"action": newAction[0][0],
				"vm-products": products[0][0]
			});

		} else {
			throw new Error('Fail to add action');
		}
	} catch (err) {
		console.log(err);
		res.status(400).json({
			message: err.message
		});
	}
};

exports._update = async (action) => {

	//check required fields
	if (!action.action_id || !action.status) {
		throw new Error('action_id and status are required');
	}

	//check action info exist
	let actionResult = await Action.getById(action.action_id);
	let actionInfo = actionResult[0][0];
	if (!actionInfo)
		throw new Error(`Action with id = ${action.action_id} does not exist`);

	console.log("actionInfo", actionInfo);

	switch (actionInfo.status) { //current status
		case Action.STATUS_NEW():
			if (action.status == Action.STATUS_IN_PROGRESS()) {
				actionInfo.status = action.status;
			} else
				throw new Error('Invalid Request! Action status can only change from "new" to "in-progress"');
			break;
		case Action.STATUS_IN_PROGRESS():
			if (action.status == Action.STATUS_COMPLETED() || action.status == Action.STATUS_ERRORED()) {
				actionInfo.status = action.status;//update action.status
				
				//get products info, then update 
				let productsResult = await VM.getProducts(actionInfo.vm_id);
				let products = productsResult[0][0].products;
				if(actionInfo.product == null){
					//actions for DO => do nothing
				}
				else if (typeof products[actionInfo.product.id] != "undefined") {
					switch (products[actionInfo.product.id].status) {
						case Product.STATUS_INSTALLING():
							products[actionInfo.product.id].status =
								action.status == Action.STATUS_COMPLETED() ?
								Product.STATUS_INSTALLED() : Product.STATUS_ERRORED();
							break;
						case Product.STATUS_UNSTALLING():
							if (action.status == Action.STATUS_COMPLETED())
								delete products[actionInfo.product.id]
							else
								products[actionInfo.product.id].status = Product.STATUS_ERRORED();
							break;
						default:
							throw new Error('Invalid Request! ');
					}
				} else {
					throw new Error('Invalid Request! Product has not been installed successfully');
				}

				actionInfo.products = products;
			} else
				throw new Error('Invalid Request! Action status can only change from "in-progess" to "completed" or "errored"');
			break;
		default: // not allowed
			throw new Error('Invalid Request! Action status can only change from "new" or "in-progess" to other status');
	}

	console.log("post-actionInfo", actionInfo);
	return await Action.updateAction(actionInfo);
}

exports.updateStatus = async (req, res, next) => {
	console.log("update action status");

	try {
		//TODO: how to authorize our app

		let result = await this._update(req.body);

		if (result[0].affectedRows == 1) { // action is updated

			let updatedAction = await Action.getById(req.body.action_id);
			let products = await VM.getProducts(updatedAction[0][0].vm_id);

			res.status(200).json({
				"message": "Action Updated!",
				"action": updatedAction[0][0],
				"vm-products": products[0]
			});
		} else {
			throw new Error('Fail to update action');
		}
	} catch (err) {
		console.log(err);
		res.status(400).json({
			message: err.message
		});
	}
};