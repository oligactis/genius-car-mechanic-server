const express = require('express');
const { MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// middlware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.far0qag.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

async function run(){
    try{
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        // Get API 
        app.get('/services', async(req, res) =>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET single Service 
        app.get('/services/:id', async (req, res) =>{
            const id = req.params.id;
            console.log('geeting specific service', id);
            const query = {_id: new ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async(req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

        // Delete API 
        app.delete('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally{
        // await client.close()
    }

}
run().catch(console.dir)

app.get("/", (req, res) =>{
    res.send("Runnign Geniud server hellow")
})

app.listen(port, () =>{
    console.log("runnign genius server port", port);
})