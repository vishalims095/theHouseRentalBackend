var{mongoose, conn} = require("../Modules/connection");
var mongoosePaginate = require('mongoose-paginate');
let  customerSchema  = mongoose.Schema(
    { 
        customer_id : {
            type : String,
            require : true,
            default : "N/A"  
        },
        customer_name : {
            type : String,
            require : true,
            default : "N/A"  
        },
      
    },
    {
        strict: true,
        collection: 'customer',
        versionKey: false
    }
    
);
exports.customerModel = conn.model('customer', customerSchema); 
