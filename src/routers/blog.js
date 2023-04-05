const express=require('express');
const { createBlog, getAllBlog, getBlog, deleteBlog, updateBlog } = require('../controller/blog');
const { protectRoute } = require('../middleware/authHelper');
const blogRouter=express.Router();
const multer=require('multer');
const path=require('path');
const shortid=require('shortid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //__dirname gets back to parent directory i.e. routes in thus cse and then dirname gives that oarent dir i.e routes which is then joined with uploads in it
      cb(null, path.join(path.dirname(__dirname),'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate()+"-"+file.originalname)
    }
});

const upload=multer({storage}); 

blogRouter.use(protectRoute);

blogRouter.route('/create')
    .post(upload.array('blogImage'),createBlog);

blogRouter.route('/getAllBlogs')
    .get(getAllBlog);

blogRouter.route('/getBlog/:id')
    .get(getBlog);

blogRouter.route('/deleteBlog/:id')
    .delete(deleteBlog);

blogRouter.route('/updateBlog/:id')
    .patch(updateBlog);

module.exports=blogRouter;