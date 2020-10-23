const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:{
        type:String
    },
    expireToken:{
        type:Date
    },
    avatar:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports=User=mongoose.model('user',userSchema);



