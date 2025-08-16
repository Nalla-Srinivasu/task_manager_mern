import {MongoClient} from 'mongodb';
const uri = "mongodb://localhost:27017/task/"
const client = new MongoClient(uri)

async function connectDb(){
    try{
        await client.connect();
        console.log("Mongodb connected suucessfully");
    }catch(error){
        console.error("Error connecting to mongodb:", error);
    }
}

export default connectDb