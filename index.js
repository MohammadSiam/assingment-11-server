const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const port = process.env.PORT || 5000

//react mongo crud starter



app.use(cors())
app.use(express.json());;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oktkt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db("Trvele");
        const usersCollection = database.collection("users");
        const offerCollection = database.collection("offers");

        //get api for order
        app.get('/offers', async (req, res) => {
            const cursor = offerCollection.find({})
            const usersorder = await cursor.toArray();
            res.send(usersorder);
        });

        //get api for user
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({})
            const users = await cursor.toArray();
            res.send(users);
        });

        //get single booking api
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await usersCollection.findOne(query);
            console.log(id)
            res.send(user)
        })

        //order post api
        app.post('/offers', async (req, res) => {
            const order = req.body;
            //console.log('orders', order)
            const result = await offerCollection.insertOne(order)
            res.json(result);
        })


        //post user api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log('Got New User ', req)
            console.log('added user', result);
            res.json(result);
        });

        //updated user api
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            //console.log('updating user', req)
            res.json(result)
        })

        //delete user api 
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
            console.log('deleting user with id ', result)
            res.json(result);
        })

        //deleted orderd api
        app.delete('/offers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await offerCollection.deleteOne(query);
            console.log('deleting user with id ', result)
            res.json(result);
        })




    } finally {
        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running my CURD server');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})