require('dotenv').config();
var {MongoClient,ObjectID} = require('mongodb');

const express = require('express');
//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');

var cors = require('cors')
const app = express();


const mongoClient = require('mongodb').MongoClient;
const url = process.env.DATABASE_URL;

const port = 3000;

//Middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(cors());

/*
app.get('/', (req, res) => {
    console.log("The first route entered");
    res.status(200).send("result is fine");
});
*/

//This is the script
mongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
    if (err) {
        console.log("Error creating database "+err);
    }
    else{
        console.log("Mongodb connected finally");
        const myDb = db.db('pragmatic');
        const staffCollection = myDb.collection('Staff');
       
        app.get('/', (req, res) => {
            console.log("First route working");
            staffCollection.find({}).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                }
                else {
                    console.log(result);
                    res.status(200).send(result);
                    console.log(result);
                }
            })
        })

    }
});

app.listen(port, () => {
    console.log("Listening to my app, coming on port "+process.env.PORT || port);
});