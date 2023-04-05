const blogModel = require("../models/blogModel");
const multer=require('multer');
const shortid=require('shortid');

module.exports.createBlog=async function createBlog(req,res){
    try{
        let dataObj=req.body;
        let user=await blogModel.findOne({user:req.id});
        if(user){
            let blogImage=[];
            if (req.files.length > 0) {
                blogImage = req.files.map((file) => {
                return { img: file.filename };
                });
            }
            dataObj.blogImage=blogImage;
            await blogModel.findOneAndUpdate({user:req.id},{
                $push:{
                    "blogs":dataObj
                }
            },{runValidators:true});
        }
        else{
            user=new blogModel();
            user.user=req.id;
            let blogImage=[];
            if (req.files.length > 0) {
                blogImage = req.files.map((file) => {
                return { img: file.filename };
                });
            }
            dataObj.blogImage=blogImage;
            user.blogs=dataObj;
            console.log(blogImage.length);
            await user.save();
        }
        return res.json({
            message:"Blog added succesfully"
        });
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.getAllBlog=async function getAllBlog(req,res){
    try{
        let blogs=await blogModel.find({user:req.id});
        if(blogs){
            return res.json({
                data:blogs
            });
        }
        else{
            return res.status(400).json({
                message:"No blogs found"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.getBlog=async function getBlog(req,res){
    try{
        const blog=await blogModel.findOne({user:req.id,"blogs._id":req.params.id}).select({
            blogs:{$elemMatch:{_id:req.params.id}}
        });
        if(blog){
            return res.json({
                data:blog
            });
        }
        else{
            return res.status(400).json({
                message:"No blogs found"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.deleteBlog=async function deleteBlog(req,res){
    try{
        const blog=await blogModel.findOne({user:req.id,"blogs._id":req.params.id}).select({
            blogs:{$elemMatch:{_id:req.params.id}}
        });
        if(blog){
            await blogModel.findOneAndUpdate({user:req.id,"blogs._id":req.params.id},{
                $pull:{blogs:{_id:req.params.id}}
            });
            return res.json({
                message:"Blog deleted successfully"
            });
        }
        else{
            return res.status(400).json({
                message:"Blog not found"
            })
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}


module.exports.updateBlog=async function updateBlog(req,res){
    try{
        let dataObj=req.body;
        let user =await blogModel.findOne({user:req.id,"blogs._id":req.params.id});
        if(!user){
            return res.status(200).json({
                message:"Blog not found"
            });
        }
        let attributes=[];
        for(let data in dataObj){
            attributes.push(data);
        }
        let blog=await blogModel.findOne({user:req.id,"blogs._id":req.params.id}).select({
            blogs:{$elemMatch:{_id:req.params.id}}
        });
        blog=blog.blogs;
        blog=blog[0];
        blog._id=undefined;
        for(let i=0;i<attributes.length;i++){
            blog[attributes[i]]=dataObj[attributes[i]];
        }
        await blogModel.findOneAndUpdate({user:req.id},{
            "$push":{
                "blogs":blog
            }
        },{runValidators:true});
        await blogModel.findOneAndUpdate({user:req.id,"blogs._id":req.params.id},{
            $pull:{blogs:{_id:req.params.id}}
        });
        return res.json({
            message:"Blog updated successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}
