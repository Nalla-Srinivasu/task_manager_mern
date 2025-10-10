const express = require('express');
const url = require('url');
const path = require('path');
const fs = require('fs');
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
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';");               

        // dynamic route handler
        // e.g. /todo -> ../apis/todo.js
        // e.g. /generateToken -> ../apis/generateToken.js
        // e.g. /user/login -> ../apis/user/login.js
        // e.g. /user/register -> ../apis/user/register.js

        // trim leading slashes
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