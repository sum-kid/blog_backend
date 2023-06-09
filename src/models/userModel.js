const mongoose=require('mongoose');
const emailValidator=require('email-validator');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');

mongoose.set('strictQuery', true);

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required']
    },
    email:{
        type:String,
        required:[true,"Email-id is required"],
        unique:[true,"Email-id already in use"],
        validate:[function(){
           return emailValidator.validate(this.email);
        },'Valid email-id is required']
    },
    password:{
        type:String,
        minLength:8,
        required:[true,"Password is required"]
    },
    confirmPassword:{
        type:String,
        minLength:8,
        required:[true,"Confirm Password is required"],
        validate:[function(){
            return this.password==this.confirmPassword;
        }," Confirm Password ans Password must be same"]
    },
    profileImage: {
        type: String,
        default: 'img/users/default.jpeg'
    },
    resetToken: {
        type:String,
        default:''
    }
},{timestamps:true});

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        const hashedPassword=await bcrypt.hash(this.password,10);
        this.password=hashedPassword;
        this.confirmPassword=undefined;
    }
    next();
});

const userModel=mongoose.model('userModel',userSchema);

module.exports=userModel;