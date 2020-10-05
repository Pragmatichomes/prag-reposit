require('dotenv').config();
var {MongoClient,ObjectID} = require('mongodb');

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var cors = require('cors')
const app = express();


const mongoClient = require('mongodb').MongoClient;
const url = process.env.DATABASE_URL;

const port = 3000;

//Middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(cors());


app.get('/', (req, res) => {
            
    res.status(200).send("result is fine");
})
/



app.listen(port, () => {
    console.log("Listening to app on port "+port);
});