const express = require('express');            
const router =  express.Router();
const {generateToken,verifyToken} = require('../configs/common_functions.js');
const {connectDb} = require('../configs/mongodb.js');
router.post("/login", async (req,res) => {
    const {username,password} = req.body;
    const res_tag = ""
    if(!username || !password){
        res_tag = res.status(400).send("username and password are required");
        return res_tag;
    }
    
    const db = await connectDb();    
    const login = await db.collection('login');
    const getUserData = login.findOne({"user":username,"password":password});
    if(username === "admin" && password === "admin"){
        const payload = {
            username:username,
            password:password
        }

        const token  =  await generateToken(payload,global.tokenKey);
        if(token){
            const sessionID = req.session.user = {name:"admin",role:"super-user"}
            console.log(sessionID);
            res_tag =  res.status(200).json({
                message: "login successful",
                token: token
            })
        }else{
           res_tag =  res.status(404).send("Token generation failed");
        }
    }else{
        res_tag = res.status(403).send("Login failed");
    }

    return res_tag;

});

module.exports = router;
