var user = require ('../Controllers/userController');
var auth = require ('../Modules/auth');
var multer = require ('multer');
var md5 = require ('md5');
var express = require  ('express')
var path = require ('path');

exports.getRouter = (app) => {

    let storage = multer.diskStorage({
        destination: function(req, file, callback) {
            console.log("multer")
            console.log(file)
            callback(null, './src/Upload/User');
        },
        filename: function(req, file, callback) {
            let fileUniqueName = md5(Date.now());
            callback(null, fileUniqueName + path.extname(file.originalname));
        }
    });
    let upload = multer({ storage: storage });

    app.route("/user/login").post(user.login);

    app.route("/user/addData").get(user.addData);

    app.route("/user/getProductData").get(user.getProductData);
    
    app.route("/user/getCustomerData").get(user.getCustomerData);

    app.route("/user/rentProduct").post(user.rentProduct);

    app.route("/user/getTransection").get(user.getTransection);

    app.route("/user/returnProduct").post(user.returnProduct);

}