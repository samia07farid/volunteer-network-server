const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djh40.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const port = 5000;

app.get('/', (req,res) => {
    res.send('Hii, this db is working');
})

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
        volunteerTasksCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

});

client.connect(err => {
    const users = client.db("volunteerNetworkEvent").collection("usersInfo");

    app.post('/addUserInfo', (req, res) => {
        const newUser = req.body;
        users.insertOne(newUser)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    }) 

    app.get('/userTask', (req, res) => {
        users.find({email: req.query.email})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.delete('/delete/:id', (req, res) => {
        users.deleteOne({_id: ObjectId(req.params.id)})
        .then((err, result)=>{
            // console.log(result)
        })
    })

});


app.listen(process.env.PORT || port)