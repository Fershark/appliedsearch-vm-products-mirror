// place the users logic here
const Product = require('../models/Product');

exports.getAll = async (req, res, next) => {
	console.log("get all products");

	try{
		let result = await Product.getAll();

		let products = {};
		result[0].forEach(product => {
			if(products[product.name] === undefined){//not added
				products[product.name] = [product];
				// products[product.name].append(product);
				delete product.name;
			}else{
				products[product.name].push(product);
				delete product.name;
			}
		});
		res.status(200).json(products);

	}catch(err){
		console.log(err);
		res.status(400).json({
			message: "Cannot get products!"
		});
	}

};

exports.getById = async (req, res, next) => {
	console.log("get product id = " + req.params.id);

	try{
		let result = await Product.getById(req.params.id);

		res.status(200).json(result[0][0]);
		
	}catch(err){
		console.log(err);
		res.status(400).json({
			message: "Cannot get products!"
		});
	}

};