const {MongoClient} = require('mongodb');
const uri = "mongodb://localhost:27017/"
const client = new MongoClient(uri)
let db;
async function connectDb(){
    try{
        await client.connect();
        console.log("Mongodb connected suucessfully");
        db =  client.db("task_manager")
        return db;
    }catch(error){
        console.error("Error connecting to mongodb:", error);
    }
}


function getDb(){
    if(!db){
        //console.error("Database is not initilized!")
        db = connectDb();
    }
    return db;
}

module.exports =  {connectDb,getDb};