const express = require('express');
const router = express.Router();
const {connectDb} = require('../configs/mongodb.js');
const { ObjectId } = require('mongodb');


router.get('/search', async (req,res) => {
    const db = await connectDb();
    const {category,name} = req.query;
    
    const condition = {};
    if(category !== ""){
        condition.category = category;
    }
    if(name !== ""){
        condition.name = name;
    }

    if((category === "" && name === "") || (category === undefined && name === undefined) || (category === null && name === null)){
        return res.status(404).send({
            status:"fail",
            res_msg:"Please search the valid data"
        })
    }
    const connect_todo = await db.collection('todo_list');
    const get_data =  await connect_todo.find(condition).toArray();    
    if(get_data){
        res.status(200).json({
            status:"success",
            data:get_data
        })
    }else{
        return res.status(404).send({
            status:"fail",
            res_msg:"data is not exist"
        })
    }
})

module.exports = router