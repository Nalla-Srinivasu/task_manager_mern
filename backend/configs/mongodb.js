const {MongoClient} = require('mongodb');
const uri = "mongodb://localhost:27017/"
const client = new MongoClient(uri)
let db;
async function connectDb(){
    if(!db){
        await client.connect();
        console.log("Mongodb connected suucessfully");
        db =  client.db("task_manager");
    }
    return db;
}

module.exports =  {connectDb};