const express = require('express');            
const router =  express.Router();
const {generateToken,verifyToken} = require('../configs/common_functions.js');
const {connectDb} = require('../configs/mongodb.js');
router.post("/login", async (req,res) => {
    const {username,password} = req.body;    
    if(!username || !password){
        return res.status(400).send("username and password are required");
    }
    
    const db = await connectDb();    
    const login = await db.collection('login');
    const getUserData = login.findOne({"user":username,"password":password});
    const userAgent = req.headers['user-agent']
    if(getUserData){
        const payload = {
            username:username,
            password:password,
            userAgent:userAgent
        }

        const token  =  await generateToken(payload,global.tokenKey,{expiresIn:'1h'});
        if(token){            
            const authToken = await res.cookie('AuthID', token,{
                httpOnly: true,
                sameSite: 'strict',
                secure:false,
                maxAge: 3600000, // 1 hour
                // domain:'http://localhost:3000/' //change domain while deployment
            })
            console.log(authToken);
            return res.status(200).json({
                message: "login successful",
                token: token
            })
        }else{
            return res.status(404).send("Token generation failed");
        }
    }else{
        return res.status(403).send("Login failed");
    }    

});

module.exports = router;
