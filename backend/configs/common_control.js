const express = require('express');
const url = require('url');
const path = require('path');
const app = express();
const session = require('express-session');

app.use(express.json())


app.use(session({
    secret:"abcdef123!@#", // used to sign the session ID
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false} // https only

}))
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