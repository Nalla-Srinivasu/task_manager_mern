const express = require('express');
const connectDb = require('./mongodb.js');
const url = require('url');
const path = require('path');
const app = express();


app.use(express.json())


// global keys

global.tokenKey  = "abcd@1234!@#$"

app.use((req,res,next) => {
    try{
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");        
        const routePath = req.path.replace(/^\/+/, '');
        if(routePath){
           const handlerPath = path.join(__dirname, "../apis", routePath + ".js");

            // dynamically import router
            const handlerModule = require(handlerPath);

            if (typeof handlerModule === "function") {
                return handlerModule(req, res, next); // plain function style
            } else if (handlerModule && handlerModule.default) {
                return handlerModule.default(req, res, next);
            } else {
                return app.use("/" + routePath, handlerModule); // router style
            }
        }
       next();
    }catch(error){
        console.error("Error in middleware:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(5000,()=>{
    console.log("server is running on port 5000");
});