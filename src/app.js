const express=require('express');
const mongoose=require('mongoose');
const app=express();
const cookieParser=require('cookie-parser');
const env=require('dotenv');
env.config();

const PORT=3000 || process.env.PORT;

app.use(express.json());
app.use(cookieParser());

const server=async ()=>{
    try{
        app.listen(PORT,()=>{
            console.log(`Server is running on PORT ${PORT}`);
        });
    }
    catch(err){
        console.log(err);
    }
}

server();

mongoose.connect(process.env.db_link)
    .then(function(){
        console.log("Connected to blog database");
    })
    .catch(function(err){
        console.log(err);
    });

const userRouter=require('./routers/user');
const blogRouter=require('./routers/blog');

app.use('/user',userRouter);
app.use('/blogs',blogRouter);

