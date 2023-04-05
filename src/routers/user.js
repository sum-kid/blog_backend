const express=require('express');
const { protectRoute } = require('../middleware/authHelper');
const userRouter=express.Router();
const {signup, signin, signout}=require('../controller/auth');

userRouter.route('/signup')
    .post(signup)

userRouter.route('/signin')
    .post(signin);

userRouter.use(protectRoute);
userRouter.route('/signout')
    .get(signout);

module.exports=userRouter;