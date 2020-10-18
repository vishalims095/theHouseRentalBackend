var{mongoose, conn} = require("../Modules/connection");
var mongoosePaginate = require('mongoose-paginate');
let  productSchema  = mongoose.Schema(
    { 
        product_id : {
            type : String,
            require : true,
            default : "N/A"  
        },
        product_title : {
            type : String,
            require : true,
            default : "N/A"  
        },
        quantity_total : {
            type : Number,
            require : true,
            default : 0  
        },
        quantity_book : {
            type : Number,
            require : true,
            default : 0  
        },
        price_perday : {
            type : Number,
            require : true,
            default : 0  
        },
    },
    {
        strict: true,
        collection: 'Product',
        versionKey: false
    }
    
);
exports.productModel = conn.model('Product', productSchema); 
