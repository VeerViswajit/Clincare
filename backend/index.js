require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const express = require("express");
const cors = require("cors");
// const { default: mongoose } = require("mongoose"); 
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const {authenticateToken} = require("./utilities");
const User = require("./models/user.model");


app.use(
    cors({
        origin:"*",
    })
);

app.get("/",(req,res)=>{
    res.json({data:"Hello There"});
});


app.post("/create-account",async (req,res)=>{
    const {fullName,email,password} = req.body;

    if(!fullName){
        return res.status(400).json({error:true, message:"Full name is required"});
    }
    if(!email){
        return res.status(400).json({error:true, message:"Email is required"});
    }
    if(!password){
        return res.status(400).json({error:true, message:"Password is required"});
    }

    const isUser = await User.findOne({email:email});

    if(isUser){
        return res.json({
            error:true,
            message:"User already exists"
        });
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET,{ expiresIn:"36000m"});

    return res.json({
        error:false,
        user,
        accessToken,
        message:"Registration Sucessful",
    });
});


app.post("/login",async (req,res)=>{
    const {email,password} = req.body;

 
    if(!email){
        return res.status(400).json({error:true, message:"Email is required"});
    }
    if(!password){
        return res.status(400).json({error:true, message:"Password is required"});
    }

    const userInfo = await User.findOne({email:email});

    if(!userInfo){
        return res.status(400).json({message:"User not found"});
    }

    if(userInfo.email == email && userInfo.password == password){
        const user = {user:userInfo};
        const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"36000",});

        return res.json({
            error:false,
            email,
            accessToken,
            message:"Login Successful",
        });
    }else{
        return res.status(400).json({
            error:true,
            message:"Invalid Credentials",
        });
    }
    
});
app.listen(8000);

module.exports = app;