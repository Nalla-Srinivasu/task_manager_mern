const express = require('express');
const router = express.Router();
const {generateToken,verifyToken} = require('../configs/common_functions.js');
const {connectDb} = require('../configs/mongodb.js');

router.post('/todo', async(req,res)=>{    
    const db = await connectDb();
    const todo_list = db.collection('todo_list');
    if(req.body.action == "add_data"){
        const {category,name} = req.body;        
        // const res_tag = ""
        if(category == "" || name == ""){
            return res.status(404).send({
                status:"fail",
                res_msg:"Please add the data for category and name of category"
            })
            // return res_tag
        }

        const get_check = await todo_list.findOne({"category":category,"name":name})        
        if(!get_check){
            await todo_list.insertOne({
                category:category,
                name:name
            });
           return res.status(200).send({
                status:"succes",
                res_msg:"Data added succesfully"
            });
        }else{
           return res.status(404).send({
                status:"fail",
                res_msg:"Please check these data once, those data has been adding"
            })
        }
    }

    if(req.body.action == "get_data"){
         try {
            const get_data = await todo_list.find().toArray(); // make sure it's plain array
            if (get_data.length > 0) {
                return res.status(200).json({
                    status: "success",
                    Details: get_data
                });
            } else {
                return res.status(404).json({
                    status: "error",
                    msg: "Data not found"
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "error",
                msg: "Server error",
                error: error.message
            });
        }
    }
})

module.exports = router