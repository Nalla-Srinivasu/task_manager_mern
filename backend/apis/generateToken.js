const express = require("express");
const router = express.Router();

const {generateToken} = require('../configs/common_functions.js');

router.post("/generateToken", async(req,res) => {
    if(req.body.action == "generate_token"){
        const {props} = req.body;
        const {action,options} = props;
        const payload = {
            action:action || "no_action",
            options:options,
        }
        const token = await generateToken(payload);
        if(token){
            res.status(200).json({
                status:"success",
                token:token
            });
        }else{
            res.status(500).json({
                status:"fail",
                token:""
            })
        }
    }
})

module.exports = router;