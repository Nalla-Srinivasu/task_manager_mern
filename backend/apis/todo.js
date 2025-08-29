const express = require('express');
const router = express.Router();
const {generateToken,verifyToken} = require('../configs/common_functions.js');
const {connectDb} = require('../configs/mongodb.js');

router.post('/todo/', async(req,res)=>{

    if(req.action == "add_data"){
        const {category,name} = req.body;
        const res_tag = ""
        if(category != "" && name != ""){
            res_tag = res.status(400).send("Please add the data for category and name of category")
            return res_tag
        }

        const db = await connectDb();
        const todo_list = db.collection('todo_list');
        const getCheck = db.findOne({"category":category,"name":name})
        if(getCheck === ""){
            const insertData = db.inserOne({
                category:category,
                name:name
            });
            res_tag = res.send(200).send("Data added succesfully");
        }else{
            res_tag = res.send(400).send("Please check these data once, those data has been adding")
        }
    }
})