const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djh40.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const volunteerTasksCollection = client.db("volunteerNetworkEvent").collection("volunteerTasks");

   
    app.post('/addEvents', (req, res) => {
        const events = req.body;
        volunteerTasksCollection.insertMany(events)
        .then(result => {
            console.log(result)
            res.send(result)
        })
    })

    app.get('/events', (req, res) => {
        volunteerTasksCollection.find({}).limit(20)
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addRegister', (req, res) => {
        const newRegister = req.body;
        volunteerTasksCollection.insertOne(newRegister)
        .then(result =>
            res.send(result.insertedCount > 0));
        console.log(newRegister);
    })

    app.get('/register', (req, res) => {
        volunteerTasksCollection.find({email: req.query.email})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

});


app.listen(process.env.PORT || port)