// place the users logic here
const Action = require('../models/Action');
const Product = require('../models/Product');
const VM = require('../models/VM')
const authorize = require('../utils/authorize');

exports._create = async (action) => {

	//check vm_id and type
	if (!action.vm_id || !action.type) {
		throw new Error({
			success: 'false',
			message: 'vm_id, type are required',
		});
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
				if (!products[action.product.id] || 
					[action.product.id].status == Product.STATUS_ERRORED()) {
					products[action.product.id] = {
						"status": Product.STATUS_INSTALLING(),
						"name": action.product.name,
						"description": action.product.description,
						"version": action.product.version
					}
				}else{
					throw new Error('Invalid Request! Product has status ' + 	
							products[action.product.id].status);
				}
				break;
			case Action.TYPE_UNINSTALL():
				//allow UNINSTALL, when product was installed
				if(typeof products[action.product.id].status != "undefined" &&
				(products[action.product.id].status == Product.STATUS_INSTALLED() || 
				products[action.product.id].status == Product.STATUS_ERRORED())){
					products[action.product.id].status = Product.STATUS_UNSTALLING();
				}else{
					throw new Error('Invalid Request! Product has not been installed successfully');
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
			res.status(200).json({
				"message": "Action Added!"
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