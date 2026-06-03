const mongoose=require("mongoose");
const passportLocalsMongoose=require("passport-local-mongoose");
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})
userSchema.plugin(passportLocalsMongoose,{
    minlength:10
});

const user=mongoose.model("user",userSchema);
module.exports=user;