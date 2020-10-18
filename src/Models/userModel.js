var{mongoose, conn} = require("../Modules/connection");
var mongoosePaginate = require('mongoose-paginate');
let  userSchema  = mongoose.Schema(
    { 
        user_id : {
            type : String,
            require : true,
            default : "N/A"  
        },
        name : {
            type : String,
            require : true,
            default : "N/A"  
        },
        email : {
            type : String,
            require : true,
            default : "N/A"  
        },
        password : {
            type : String,
            require : true,
            default : "N/A"  
        },
    },
    {
        strict: true,
        collection: 'User',
        versionKey: false
    }
    
);
exports.UserModel = conn.model('User', userSchema); 
