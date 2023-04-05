const mongoose=require('mongoose');

mongoose.set('strictQuery',true);

const blogSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userModel',
        required:true
    },
    blogs:[
        {
            title:{
                type:String,
                required:true,
                trim:true
            },
            description:{
                type:String,
                trim:true
            },
            blogImage:[
                { img:String }
            ]
        }
    ]
},{timestamps:true});

const blogModel=mongoose.model('blogModel',blogSchema);

module.exports=blogModel;