const jwt=require('jsonwebtoken');
const env=require('dotenv');
const userModel = require('../models/userModel');
env.config();

module.exports.protectRoute=async function protectRoute(req,res,next){
    try{
        if(req.cookies.login){
            let isVerified=jwt.verify(req.cookies.login,process.env.JWT_SECRET_KEY);
            if(isVerified){
                req.id=isVerified.payload;
                //we are attaching userid to the req
                //console.log(req.id);
                next();
            }
            else{
                return res.json({
                    message:"User not verified"
                });
            }
        }
        else{
            return res.json({
                message:"Plese login again"
            });
        }
    }
    catch(err){
        return res.json({
            message:err.message
        });
    }
}