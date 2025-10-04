const express = require('express');
const router = express.Router();
const {generateToken,verifyToken} = require('../configs/common_functions.js');
const {connectDb} = require('../configs/mongodb.js');
const { ObjectId } = require('mongodb');
const { verify } = require('jsonwebtoken');

router.post('/todo', async(req,res)=>{    
    const db = await connectDb();
    const todo_list = db.collection('todo_list');
    const header_token = req.headers.authorization
    if(req.body.action == "add_data"){
        const token =  header_token !== "" && header_token !== undefined ? header_token.split(" ")[1]:false;
        if(!token){
            return res.status(401).json({
                status:"error",
                res_msg:"unauthorized access, token is missing"
            })
        }else{
            const verify_token = await verifyToken(token)            
            if(!verify_token){
                return res.status(401).json({
                    status:"error",
                    msg:"unauthorized access, token is invalid"
                });
            }else if(verify_token.action !== "add_data"){
                return res.status(401).json({
                    status:"error",
                    msg:"unauthorized access, token action is invalid"
                });
            }else if(verify_token.exp < 15 * 60 * 1000){
                return res.status(401).json({
                    status:"error",
                    msg:"unauthorized access, token is expired"
                });
            }else{
                // remove token in cache(redis)
            }
        }
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
            try{
                await todo_list.insertOne({
                    category:category,
                    name:name
                });
               return res.status(200).send({
                    status:"success",
                    res_msg:"Data added successfully"
                });
            }catch(e){
                console.error("DB error:",e.message)
                return res.status(500).send({
                    status:"DB error",
                    res_msg:e.message
                })
            }
        }else{
           return res.status(404).send({
                status:"fail",
                res_msg:"Please check these data once, those data has been adding"
            })
        }
    }

    if(req.body.action == "get_data"){
        const token =  header_token !== "" && header_token !== undefined ? header_token.split(" ")[1]:false;
        if(!token){
            return res.status(401).json({
                status:"error",
                msg:"unauthorized access, token is missing"
            })
        }else{
            const verify_token = await verifyToken(token)            
            if(!verify_token){
                return res.status(401).json({
                    status:"error",
                    msg:"unauthorized access, token is invalid"
                });
            }else if(verify_token.action != "get_data"){
                return res.status(401).json({
                    status:"error",
                    msg:"unauthorized access, token action is invalid"
                });
            }else if(verify_token.exp < 15 * 60 * 1000){
                return res.status(401).json({
                    status:"error",
                    msg:"unauthorized access, token is expired"
                });
            }else{
               // remove token in cache(redis)
            }
        }
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

    if(req.body.action == "update_data"){
        const token =  header_token !== "" && header_token !== undefined ? header_token.split(" ")[1]:false;
        if(!token){
            return res.status(401).json({
                status:"error",
                res_msg:"unauthorized access, token is missing"
            })
        }else{
            const verify_token = await verifyToken(token);
            if(!verify_token){
                return res.status(401).json({
                    status:"error",
                    res_msg:"unauthorized access, token is invalid"
                });
            }else if(verify_token.action !== "update_data"){
                return res.status(401).json({
                    status:"error",
                    res_msg:"unauthorized access, token action is invalid"
                })
            }else if(verify_token.exp < 15 * 60 * 1000){
                return res.status(401).json({
                    status:"error",
                    res_msg:"unauthorized access, token is expired"
                });
            }else{
                // remove token in cache(redis)
            }
        }
        const {category,name,data_id} = req.body;
        const obj_id = await new ObjectId(data_id)
        const Objchk = await ObjectId.isValid(data_id)

        if(category == "" || name == ""){
            return res.status(404).send({
                status: "fail",
                res_msg: "Please check the data for category and name of category"
            })
        }else if(data_id == ""){
            return res.status(404).send({
                status:"fail",
                res_msg:"please check the data id"
            })
        }else if(!Objchk){
            return res.status(404).send({
                status:"fail",
                res_msg:"please check the data id once again"
            })
        }
        const update_check = await todo_list.findOne({"_id": obj_id})
        if(update_check){

            try{
                await todo_list.updateOne(
                    {"_id": obj_id},
                    {$set:{
                        category:category,
                        name:name
                    }}
                )
    
                return res.status(200).send({
                    status:"success",
                    res_msg:"Data updated successfully"
                })
            }catch(e){
                console.error("DB error:",e.message)
                return res.status(500).send({
                    status:"DB error",
                    res_msg:e.message
                })
            }
        }else{
            return res.status(404).send({
                status:"fail",
                res_msg:"check the data id once again, data not found"
            })
        }

    }

    if(req.body.action === "delete_data"){

        const token =  header_token !== "" && header_token !== undefined ? header_token.split(" ")[1]:false;
        if(!token){
            return res.status(401).json({
                status:"error",
                res_msg:"unauthorized access, token is missing"
            })
        }else{
            const verify_token = await verifyToken(token)
            if(!verify_token){
                return res.status(401).json({
                    status:"error",
                    res_msg:"unauthorized access, token is invalid"
                });
            }else if(verify_token.action !== "delete_data"){
                return res.status(401).json({
                    status:"error",
                    res_msg:"unauthorized access, token action is invalid"
                });
            }else if(verify_token.exp < 15 * 60 * 1000){
                return res.status(401).json({
                    status:"error",
                    res_msg:"unauthorized access, token is expired"
                });
            }else{
                // remove token in cache(redis)
            }
        }

        const {data_id} = req.body;
        const obj_id = await new ObjectId(data_id)
        const Objchk = await ObjectId.isValid(data_id)
        if(data_id == ""){
            return res.status(404).send({
                status:"fail",
                res_msg:"please check the data once again"
            })
        }else if(!Objchk){
            return res.status(404).send({
                status:"fail",
                res_msg:"please check the data id once again"
            })
        }

        const delete_check = await todo_list.findOne({"_id":obj_id})
        if(delete_check){
            try{
                await todo_list.deleteOne({"_id":obj_id});
                return res.status(200).send({
                    status:"success",
                    res_msg:"Data deleted successfully"
                })
            }catch(e){
                console.error("DB error:",e.message)
                return res.status(500).send({
                    status:"Db error",
                    res_msg:e.message
                })
            }
        }else{
            console.error("Db error: Data not found")
            return res.status(404).send({
                status:"fail",
                res_msg:"Data not found"
            })
        }
    }
})

module.exports = router