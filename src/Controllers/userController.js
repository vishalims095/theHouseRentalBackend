var commFunc = require('../Modules/commonFunction');
var responses = require('../Modules/responses');
var constant = require('../Modules/constant');
var config = require('../Config/production')
const { UserModel } = require('../Models/userModel')
const { customerModel } = require('../Models/customerModel')
const { transectionModel } = require('../Models/transectionModel')
const { productModel } = require('../Models/productModel')
var uniqid = require('uniqid');


/*--------------------------------------
++++++++++++++ login +++++++++++++++++++
--------------------------------------*/
exports.login = async (req, res) => {
	try {
		let {email, password} = req.body
		if(email == "admin@gmail.com" && password == '12345678'){
			res.Success({}, "Login Success")
		} else {
			throw new Error('Invalid credential')
		}
	} catch (error) {
		res.status(403).Error(error.message)
	}
}


/*---------------------------------
++++++++++++ addData +++++++++++++
---------------------------------*/
// add 5 product && 5 customer && remove transection

exports.addData = async(req, res) => {
	try {
		let removeCustomer = await customerModel.remove({})
		let removeProduct = await productModel.remove({})
		let productData = [
			{product_id : "prod-1234", product_title : "Table", quantity_total : 50, quantity_book : 0, price_perday : 10},
			{product_id : "prod-1235", product_title : "Chair", quantity_total : 50, quantity_book : 0, price_perday : 15},
			{product_id : "prod-1236", product_title : "Bed", quantity_total : 50, quantity_book : 0, price_perday : 20},
			{product_id : "prod-1237", product_title : "Sofa", quantity_total : 50, quantity_book : 0, price_perday : 30},
			{product_id : "prod-1238", product_title : "Car", quantity_total : 50, quantity_book : 0, price_perday : 40},
		]
		let customerData = [
			{customer_id : "cust-001", customer_name : "vishal"},
			{customer_id : "cust-002", customer_name : "Suraj"},
			{customer_id : "cust-003", customer_name : "Aman"},
			{customer_id : "cust-004", customer_name : "Ranjan"},
			{customer_id : "cust-005", customer_name : "vashu"},
		]
		//save product data
		let saveProductData = await productModel.insertMany(productData)
		if(!saveProductData) {
			throw new Error('Unable to save product data')
		}

		//save customer data
		let saveCustomerData = await customerModel.insertMany(customerData)
		if(!saveCustomerData) {
			throw new Error('Unable to save Customer data')
		}
		// remove old transection data
		let removeTransection = await transectionModel.remove({})
		res.Success({}, "Both Customer and product data saved and transection data removed")
	} catch(error) {
		res.status(403).Error(error.message)
	}
}

/*-----------------------------------------------------
++++++++++++++++++++ getProductData +++++++++++++++++++
-----------------------------------------------------*/
exports.getProductData = async(req, res) => {
	try {
		let productData = await productModel.find({}).sort({product_title : 1})
		res.Success(productData, "Product List")
	} catch(error) {
		res.status(403).Error(error.message)
	}
}

/*-----------------------------------------------------
++++++++++++++++++++ getCustomerData +++++++++++++++++++
-----------------------------------------------------*/
exports.getCustomerData = async(req, res) => {
	try {
		let customerData = await customerModel.find({}).sort({customer_name : 1})
		res.Success(customerData, "customer List")
	} catch(error) {
		res.status(403).Error(error.message)
	}
}

/*---------------------------------------------------
++++++++++++++++ rentProduct ++++++++++++++++++++++++
---------------------------------------------------*/
exports.rentProduct = async(req, res) => {
	try {
		let {product_id, quantity, customer_id, transection_amount, left_quantity} = req.body
		
		//check product
		let productData = await productModel.findOne({_id : product_id})
		if(!productData) {
			throw new Error('Invalid Product Id')
		}

		let transection_id = uniqid('tran-')
		let transection_date_time =  Math.round((new Date()).getTime() / 1000);
		let transection_type = "Rent Out"
		
		// save transection datra
		let data = {left_quantity, transection_amount, product_id, quantity, customer_id, transection_id, transection_type, transection_date_time}
		console.log(data)
		let saveTransection = new transectionModel(data)
		let saveData = await saveTransection.save()
		if(!saveData) {
			throw new Error('Unable to process transection')
		}
		
		// update product quantity
		let total_on_rent = productData.quantity_book + quantity
		let updateProduct = await productModel.findOneAndUpdate({_id : product_id},{quantity_book : total_on_rent, quantity_total : left_quantity}, {new : true} )
		if(!updateProduct) {
			throw new Error('Unable to update product quantity')
		}
		res.Success({}, "Product successfully rent out")
	} catch(error) {
		res.status(403).Error(error.message)
	}
}

/*--------------------------------------------------
++++++++++++++++ getTransection ++++++++++++++++++++
--------------------------------------------------*/
exports.getTransection = async(req, res) => {
	try {
		let data = await transectionModel.find({}).sort({_id : -1}).populate('product_id').populate('customer_id')
		res.Success(data, "Transection data")
	} catch(error) {

	}
}

/*-------------------------------------------------
+++++++++++++++++ returnProduct +++++++++++++++++++
--------------------------------------------------*/

exports.returnProduct = async(req, res) => {
	try {
		let {transection_id} = req.body
		let checkTransectionId = await transectionModel.findOne({_id : transection_id})
		if(!checkTransectionId) {
			throw new Error('Invalid Id')
		} else {
			let sellQuantity = checkTransectionId.quantity
			// get product data and add return product quantity
			let productData = await productModel.findOne({_id : checkTransectionId.product_id})
			if(!productData) {
				throw new Error('Invalid product Id')
			}
			let quantity_book = productData.quantity_book - sellQuantity // deduct quantity from on rent product because it returned
			let quantity_total = productData.quantity_total + sellQuantity // add product quantity because it comes in stock
			let updateStock = await productModel.findOneAndUpdate({_id : productData._id}, {quantity_book, quantity_total}, {new : true})
			if(!updateStock) {
				throw new Error('Unable to update stock')
			} else {
				// update transection status because it return back
				let updatreStatus = await transectionModel.findOneAndUpdate({_id : transection_id}, {transection_type : 'Product returned'}, {new : true})
				if(!updatreStatus) {
					throw new Error('Unable to update transection status')
				} else {
					res.Success(updatreStatus, "Transection status updated")
				}
			}
		}
	} catch(error) {
		res.status(403).Error(error.message)
	}
}