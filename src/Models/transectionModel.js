var{mongoose, conn} = require("../Modules/connection");
var mongoosePaginate = require('mongoose-paginate');
let  transectionSchema  = mongoose.Schema(
    { 
        customer_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'customer',
            default : null  
  
        },
        product_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            default : null  
        },
        transection_id : {
            type : String,
            require : true,
            default : "N/A"  
        },
        transection_date_time : {
            type : Number,
            require : true,
            default : 0  
        },
        transection_type : {
            type : String,
            require : true,
            default : "N/A"  
        },
        quantity : {
            type : Number,
            require : true,
            default : 0  
        },
        transection_amount : {
            type : Number,
            require : true,
            default : 0  
        }
    },
    {
        strict: true,
        collection: 'transection',
        versionKey: false,
        timestamps: true,
    }
    
);
exports.transectionModel = conn.model('transection', transectionSchema); 
