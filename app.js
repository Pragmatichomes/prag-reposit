require('dotenv').config();
var {MongoClient,ObjectID} = require('mongodb');

const express = require('express');
//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');

var cors = require('cors')
const app = express();


const mongoClient = require('mongodb').MongoClient;
const url = process.env.DATABASE_URL;

const port = process.env.PORT || 3000;

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
        const accountCollection = myDb.collection('Accounting');
        const adminCollection = myDb.collection('Admin');
        const blogCollection = myDb.collection('Blog');
        const consultantCollection = myDb.collection('Consultant');
        const finalregistrationCollection = myDb.collection('Finalregistration');
        const landCollection = myDb.collection('Land');
        const landDetailsCollection = myDb.collection('LandDetails');
        const landUploadCollection = myDb.collection('LandUpload');
        const houseCollection = myDb.collection('House');
        const houseDetailsCollection = myDb.collection('HouseDetails');
        const houseUploadCollection = myDb.collection('HouseUpload');
        const messageCollection = myDb.collection('Message');
        const propertyCollection = myDb.collection('Property');
        const staffCollection = myDb.collection('Staff');
        const subscribersCollection = myDb.collection('Subscribers');

        //Admin
        //Admin login
        //Admin create

        //admin get all
        app.get('/admin/all', (req, res) => {
            
            adminCollection.find({}).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                }
                else {
                    console.log(result);
                    res.status(200).send(result);
                }
            })
        })
        
        //accounting create
        app.post('/admin/create', (req, res) => {

            const query = { email: req.body.email }

            adminCollection.findOne(query, (err, result) => {
                const newAdmin = {
                    name : req.body.name,
                    email : req.body.email,
                    category : req.body.category,
                    password: bcrypt.hashSync(req.body.password, 10)
                }

                if(result == null){
                    adminCollection.insertOne(newAdmin, (err, result) => {
                        res.status(200).send(result);
                    })
                }
                else {
                    res.status(400).send();
                }
            })

        })

        app.post('/admin/auth', (req, res) => {
            
            const password = req.body.password;
            
            const query = {
                //email : req.body.email,
                category : req.body.category
            }

            adminCollection.findOne(query, (err, result) => {
                
                if (result != null){
                    
                    const user = {
                        category: result.category
                    }
                    
                    bcrypt.compare(password, result.password, (err, isMatch) => {
                        
                        if (err){
                            const objToSend = {
                                token: "Nil",
                                statusMsg: "Problem authenticating login",
                                user: {
                                    category: ''
                                }
                            }
                            res.status(200).send(JSON.stringify(objToSend));
                        }
                        if (isMatch) {
                            const token = jwt.sign({user: user}, process.env.JWT_SECRET, {
                                expiresIn: '1d'
                            });

                            const objToSend = {
                                token: token,
                                statusMsg: "Nil",
                                user: {
                                    category: user.category
                                }
                            }
                            
                            res.status(200).send(JSON.stringify(objToSend));
                        }
                        else {
                            const objToSend = {
                                token: "Nil",
                                statusMsg: "Wrong Password",
                                user: {
                                    category: ''
                                }
                            }
                            res.status(200).send(JSON.stringify(objToSend));
                        }
                    })

                } else {
                    const objToSend = {
                        token: "Nil",
                        statusMsg: "Account not found",
                        user: {
                            category: ''
                        }
                    }
                    res.status(200).send(JSON.stringify(objToSend));
                }

            })

        })

        app.post('/admin/register', (req, res) => {

            const query = { email: req.body.email }

            usersCollection.findOne(query, (err, result) => {

                if(err){
                    const objToSend = {
                        token: "Nil",
                        statusMsg: "Account with same details already exists",
                        user: {
                            id: '',
                            name: '',
                            email: '',
                            phone: '',
                            location: '',
                            images: '',
                            category: '',
                            token: ''
                        }
                    }
                    res.status(200).send(JSON.stringify(objToSend));
                }

                else {
                    const newUser = {
                        name : req.body.name,
                        email : req.body.email,
                        phone : req.body.phone,
                        location : req.body.location,
                        token : req.body.token,
                        password: bcrypt.hashSync(req.body.password, 10),
                        images : req.body.images,
                        category: 'Student'
                    }
                    
                    if(result == null){
                        usersCollection.insertOne(newUser, (err, res) => {

                            const user = {
                                id: res._id,
                                name : res.name,
                                email : res.email,
                                phone : res.phone,
                                location : res.location,
                                token : res.token,
                                images : res.images,
                                category: 'Student'
                            }

                            const token = jwt.sign({user: user}, process.env.JWT_SECRET, {
                                expiresIn: '1d'
                            });

                            const objToSend = {
                                token: token,
                                statusMsg: "Login successful",
                                user: user
                            }
                            
                            res.status(200).send(JSON.stringify(objToSend));
                        })
                    }
                    else {
                        const objToSend = {
                            token: "Nil",
                            statusMsg: "Account with same details already exists",
                            user: {
                                id: '',
                                name: '',
                                email: '',
                                phone: '',
                                location: '',
                                images: '',
                                category: '',
                                token: ''
                            }
                        }
                        res.status(200).send(JSON.stringify(objToSend));
                    }
                }
            })

        })


        app.post('/auth', (req, res) => {
            
            const password = req.body.password;
            
            const query = {
                email : req.body.email,
                //category : req.body.category
            }

            finalregistrationCollection.findOne(query, (err, result) => {
                
                if (result != null){
                    
                    const user = {
                        surname: result.name,
                        email: result.email,
                        firstname: result.firstname
                    }
                    
                    bcrypt.compare(password, result.password, (err, isMatch) => {
                        
                        if (err){
                            const objToSend = {
                                token: "Nil",
                                statusMsg: "Problem authenticating login",
                                user: {
                                    surname: '',
                                    email: '',
                                    firstname: ''
                                }
                            }
                            res.status(200).send(JSON.stringify(objToSend));
                        }
                        if (isMatch) {
                            const token = jwt.sign({user: user}, process.env.JWT_SECRET, {
                                expiresIn: '1d'
                            });

                            const objToSend = {
                                token: token,
                                user: {
                                    surname: user.surname,
                                    email: user.email,
                                    firstname: user.firstname
                                }
                            }
                            
                            res.status(200).send(JSON.stringify(objToSend));
                        }
                        else {
                            const objToSend = {
                                token: "Nil",
                                statusMsg: "Wrong Password",
                                user: {
                                    surname: '',
                                    email: '',
                                    firstname: ''
                                }
                            }
                            res.status(200).send(JSON.stringify(objToSend));
                        }
                    })

                } else {
                    const objToSend = {
                        token: "Nil",
                        statusMsg: "Account not found",
                        user: {
                            surname: '',
                            email: '',
                            firstname: ''
                        }
                    }
                    res.status(200).send(JSON.stringify(objToSend));
                }

            })

        })

        
        //ACCOUNTING
        //accounting get all
        app.get('/accounting/all', (req, res) => {
            
            accountCollection.find({}).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                }
                else {
                    console.log(result);
                    res.status(200).send(result);
                }
            })
        })
        //accounting get valid
        //accounting get by id

        //accounting create
        app.post('/accounting/create', (req, res) => {
            console.log("accounting create called");
            const body = req.body;
            subscribersCollection.insertOne(body, (err, result) => {
                if(err){
                    const message = {
                        status: "Error",
                        message: "Error creating the account"
                    }
                    res.status(400).send()
                }
                else {
                    const message = {
                        status: "Success",
                        message: "Payment registered successfully"
                    }
                    res.status(200).send(message);
                }
            })
            
        })

        app.delete('/blog/:id', (req, res) => {

            let id = req.params.id;
            var sid = new ObjectID(id);
            
            cvReferenceCollection.deleteOne({_id: sid}, (err, result) => {
                if (err){
                    res.status(400).send();
                }
                else {
                    res.status(200).send();
                }
            })
            
        })

        //blog get all
        app.get('/blog/all', (req, res) => {
            
            blogCollection.find({}).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                }
                else {
                    console.log(result);
                    res.status(200).send(result);
                    console.log()
                }
            })
        })
        //blog create
        app.post('/blog/create', (req, res) => {
            const body = req.body;
            console.log("Blog create called");
            blogCollection.insertOne(body, (err, result) => {
                if(err){
                    const message = {
                        status: "Error",
                        message: "Error creating the blog"
                    }
                    res.status(400).send();
                    console.log("Error reading file");
                }
                else {
                    const message = {
                        status: "Success",
                        message: "Blog registered successfully"
                    }
                    res.status(200).send(message);
                }
            })
            
        })


        //consultant get all
        app.get('/consultant/all', (req, res) => {
            
            consultantCollection.find({}).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                }
                else {
                    console.log(result);
                    res.status(200).send(result);
                    console.log()
                }
            })
        })

        //consultant create
        app.post('/consultant/create', (req, res) => {
            const body = req.body;
            consultantCollection.insertOne(body, (err, result) => {
                if(err){
                    const message = {
                        status: "Error",
                        message: "Error creating the consultant"
                    }
                    res.status(400).send()
                }
                else {
                    const message = {
                        status: "Success",
                        message: "Consultant registered successfully"
                    }
                    res.status(200).send(message);
                }
            })
            
        })

        //blog get all
        app.get('/client/all', (req, res) => {
            
            finalregistrationCollection.find({}).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                }
                else {
                    console.log(result);
                    res.status(200).send(result);
                }
            })
        })



        //finalregistration create
        app.post('/client/create', (req, res) => {
            const body = req.body;

           /* const datax = {
                userid: req.body.userid,
                surname: req.body.surname,
                firstname: req.body.firstname,
                middlename: req.body.middlename,
                location: req.body.location,
                email: req.body.email,
                phone: req.body.phone,
                birthdate: req.body.birthdate,
                picture: req.body.picture,
                password: "Nil",
                oripass: "Nil",
                num_interest: req.body.num_interest,
                num_property: req.body.num_property,
                agent: req.body.agent,
                date: req.body.date
              }
            */

            finalregistrationCollection.insertOne(body, (err, result) => {
                if(err){
                    const message = {
                        status: "Error",
                        message: "Error creating the client account"
                    }
                    res.status(400).send()
                }
                else {
                    const message = {
                        status: "Success",
                        message: "Client registered successfully"
                    }
                    res.status(200).send(message);
                }
            })
            
        })

        app.get('/client/find/:email', (req, res) => {
            const query = {
                email: req.params.email
            }
            finalregistrationCollection.findOne(query, (err, result) => {
                if (result == null){
                    res.status(400).send();
                }
                else {
                    res.status(200).send(result);
                }
            });
        })

        app.get('/client/:id', (req, res) => {
            //let id = req.params.id;
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                _id: ObjectId(req.params.id)
            }
            
            finalregistrationCollection.findOne(query, (err, result) => {
                if (result == null){
                    //console.log(err);
                    res.status(400).send();
                }
                else {
                    //console.log(result);
                    res.status(200).send(result);
                }
            });
            
        })

        app.put('/client/update_details/:id', (req, res) => {
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                _id: ObjectId(req.params.id)
            }

            const newSet = {$set : {surname : req.body.surname, firstname: req.body.firstname, location: req.body.location, birthdate: req.body.birthdate, email: req.body.email, phone: req.body.phone} }
            
            finalregistrationCollection.updateOne(query, newSet, {upsert:true}, (err, result) => {
                if (err) {
                    res.status(500).send({ message: 'An error has occurred'});
                } else {
                    res.status(200).send({message: "Updated successfully"});
                }
            });
        }) 

        app.put('/client/update_num_property/:email', (req, res) => {
            //const ObjectId  = require('mongodb').ObjectID;
            const query = {
                email: req.params.email
            }

            const newSet = {$set : {num_property : req.body.num_property} }
            
            finalregistrationCollection.updateOne(query, newSet, {upsert:true}, (err, result) => {
                if (err) {
                    res.status(500).send({ message: 'An error has occurred'});
                } else {
                    res.status(200).send({message: "Updated successfully"});
                }
            });
        }) 

        

        //land get all
        app.get('/land/all', (req, res) => {
            
            landCollection.find({}).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                }
                else {
                    console.log(result);
                    res.status(200).send(result);
                    console.log()
                }
            })
        })

        //land get by id
        app.get('/land/:estate', (req, res) => {
            //let id = req.params.id;
            const query = {
                //_id: req.params.id
                estate: req.params.estate
            }
            
            landCollection.find(query).sort({date: -1}).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                    console.log("error")
                }
                else {
                    res.status(200).send(result);
                    console.log(result);
                }
            })
            
        })

        app.get('/land/:id', (req, res) => {
            //let id = req.params.id;
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                _id: ObjectId(req.params.id)
                //estate: req.params.estate
            }
            
            landCollection.find(query).sort({date: -1}).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                    console.log("error")
                }
                else {
                    res.status(200).send(result);
                    console.log(result);
                }
            })
            
        })
        //land create
        app.post('/land/create', (req, res) => {
            const body = req.body;
            landCollection.insertOne(body, (err, result) => {
                if(err){
                    const message = {
                        status: "Error",
                        message: "Error creating the listing"
                    }
                    res.status(400).send()
                }
                else {
                    const message = {
                        status: "Success",
                        message: "Land registered successfully"
                    }
                    res.status(200).send(message);
                }
            })
        })

         //land detailscreate
         app.post('/land_details/create', (req, res) => {
            const body = req.body;
            landDetailsCollection.insertOne(body, (err, result) => {
                if(err){
                    const message = {
                        status: "Error",
                        message: "Error creating the listing"
                    }
                    res.status(400).send()
                }
                else {
                    const message = {
                        status: "Success",
                        message: "Land registered successfully"
                    }
                    res.status(200).send(message);
                }
            })
        })

        //land get all
        app.get('/land_details/all', (req, res) => {
            
            landDetailsCollection.find({}).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                }
                else {
                    console.log(result);
                    res.status(200).send(result);
                    console.log()
                }
            })
        })

        app.delete('/land_details/delete/:id', (req, res) => {
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                _id: ObjectId(req.params.id)
            }
            landDetailsCollection.remove(query, {safe:true}, function(err, result) {
                if (err) {
                    res.status(500).send({ message: 'An error has occurred'});
                } else {
                    res.status(200).send({message: "Updated successfully"});
                }
            });
        })  

        //land get by id
        app.get('/land_details/:land_id', (req, res) => {
            //let id = req.params.id;
            const query = {
                //_id: req.params.id
                land_id: req.params.land_id
            }
            
            landDetailsCollection.find(query).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                    console.log("error")
                }
                else {
                    res.status(200).send(result);
                    console.log(result);
                }
            })
        })

        

        //land upload create
        app.post('/land_upload/create', (req, res) => {
            const body = req.body;
            landUploadCollection.insertOne(body, (err, result) => {
                if(err){
                    const message = {
                        status: "Error",
                        message: "Error creating the listing"
                    }
                    res.status(400).send()
                }
                else {
                    const message = {
                        status: "Success",
                        message: "Land registered successfully"
                    }
                    res.status(200).send(message);
                }
            })
        })

        app.get('/land_upload/all', (req, res) => {
            
            landUploadCollection.find({}).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                }
                else {
                    console.log(result);
                    res.status(200).send(result);
                    console.log()
                }
            })
        })


        app.delete('/land_upload/delete/:id', (req, res) => {
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                _id: ObjectId(req.params.id)
            }
            landUploadCollection.remove(query, {safe:true}, function(err, result) {
                if (err) {
                    res.status(500).send({ message: 'An error has occurred'});
                } else {
                    res.status(200).send({message: "Updated successfully"});
                }
            });
        })  

        //land get by id
        app.get('/land_upload/:land_id', (req, res) => {
            //let id = req.params.id;
            const query = {
                //_id: req.params.id
                land_id: req.params.land_id
            }
            
            landUploadCollection.find(query).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                    console.log("error")
                }
                else {
                    res.status(200).send(result);
                    console.log(result);
                }
            })
        })



        //house get all
       //land get all
    app.get('/house/all', (req, res) => {
        
    houseCollection.find({}).toArray((err, result) => {
        if (result == null){
            res.status(400).send();
        }
        else {
            console.log(result);
            res.status(200).send(result);
            console.log()
        }
    })
    })

    //land get by id
    app.get('/house/:estate', (req, res) => {
        //let id = req.params.id;
        const query = {
            //_id: req.params.id
            estate: req.params.estate
        }
        
        houseCollection.find(query).sort({date: -1}).toArray((err, result) => {
            if (result == null){
                res.status(400).send();
                console.log("error")
            }
            else {
                res.status(200).send(result);
                console.log(result);
            }
        })
        
    })

    app.get('/house/:id', (req, res) => {
        //let id = req.params.id;
        const ObjectId  = require('mongodb').ObjectID;
        const query = {
            _id: ObjectId(req.params.id)
            //estate: req.params.estate
        }
        
        houseCollection.find(query).sort({date: -1}).toArray((err, result) => {
            if (result == null){
                res.status(400).send();
                console.log("error")
            }
            else {
                res.status(200).send(result);
                console.log(result);
            }
        })
        
    })

    //land create
    app.post('/house/create', (req, res) => {
        const body = req.body;
        houseCollection.insertOne(body, (err, result) => {
            if(err){
                const message = {
                    status: "Error",
                    message: "Error creating the listing"
                }
                res.status(400).send()
            }
            else {
                const message = {
                    status: "Success",
                    message: "Land registered successfully"
                }
                res.status(200).send(message);
            }
        })
    })

     //land detailscreate
     app.post('/house_details/create', (req, res) => {
        const body = req.body;
        houseDetailsCollection.insertOne(body, (err, result) => {
            if(err){
                const message = {
                    status: "Error",
                    message: "Error creating the listing"
                }
                res.status(400).send()
            }
            else {
                const message = {
                    status: "Success",
                    message: "Land registered successfully"
                }
                res.status(200).send(message);
            }
        })
    })

    //land get all
    app.get('/house_details/all', (req, res) => {
        
        houseDetailsCollection.find({}).toArray((err, result) => {
            if (result == null){
                res.status(400).send();
            }
            else {
                console.log(result);
                res.status(200).send(result);
                console.log()
            }
        })
    })

    app.delete('/house_details/delete/:id', (req, res) => {
        const ObjectId  = require('mongodb').ObjectID;
        const query = {
            _id: ObjectId(req.params.id)
        }
        houseDetailsCollection.remove(query, {safe:true}, function(err, result) {
            if (err) {
                res.status(500).send({ message: 'An error has occurred'});
            } else {
                res.status(200).send({message: "Updated successfully"});
            }
        });
    })  

    //land get by id
    app.get('/house_details/:house_id', (req, res) => {
        //let id = req.params.id;
        const query = {
            //_id: req.params.id
            land_id: req.params.land_id
        }
        
        houseDetailsCollection.find(query).toArray((err, result) => {
            if (result == null){
                res.status(400).send();
                console.log("error")
            }
            else {
                res.status(200).send(result);
                console.log(result);
            }
        })
    })

    

    //land upload create
    app.post('/house_upload/create', (req, res) => {
        const body = req.body;
        houseUploadCollection.insertOne(body, (err, result) => {
            if(err){
                const message = {
                    status: "Error",
                    message: "Error creating the listing"
                }
                res.status(400).send()
            }
            else {
                const message = {
                    status: "Success",
                    message: "Land registered successfully"
                }
                res.status(200).send(message);
            }
        })
    })

    app.get('/house_upload/all', (req, res) => {
        
        houseUploadCollection.find({}).toArray((err, result) => {
            if (result == null){
                res.status(400).send();
            }
            else {
                console.log(result);
                res.status(200).send(result);
                console.log()
            }
        })
    })


    app.delete('/house_upload/delete/:id', (req, res) => {
        const ObjectId  = require('mongodb').ObjectID;
        const query = {
            _id: ObjectId(req.params.id)
        }
        houseUploadCollection.remove(query, {safe:true}, function(err, result) {
            if (err) {
                res.status(500).send({ message: 'An error has occurred'});
            } else {
                res.status(200).send({message: "Updated successfully"});
            }
        });
    })  

    //land get by id
    app.get('/house_upload/:house_id', (req, res) => {
        //let id = req.params.id;
        const query = {
            //_id: req.params.id
            land_id: req.params.land_id
        }
        
        houseUploadCollection.find(query).toArray((err, result) => {
            if (result == null){
                res.status(400).send();
                console.log("error")
            }
            else {
                res.status(200).send(result);
                console.log(result);
            }
        })
    })




        //message get all
        app.get('/message/all', (req, res) => {
            
            messageCollection.find({}).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                }
                else {
                    console.log(result);
                    res.status(200).send(result);
                    console.log()
                }
            })
        })

        //Message create
        app.post('/message/create', (req, res) => {
            const body = req.body;
            messageCollection.insertOne(body, (err, result) => {
                if(err){
                    const message = {
                        status: "Error",
                        message: "Error creating the message"
                    }
                    res.status(400).send()
                }
                else {
                    const message = {
                        status: "Success",
                        message: "Messages created successfully"
                    }
                    res.status(200).send(message);
                }
            })
            
        })

        

        app.put('/property/update_status/:id', (req, res) => {
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                _id: ObjectId(req.params.id)
            }

            const newSet = {$set : {status : req.body.status} }
            
            propertyCollection.updateOne(query, newSet, {upsert:true}, (err, result) => {
                if (err) {
                    res.status(500).send({ message: 'An error has occurred'});
                } else {
                    res.status(200).send({message: "Updated successfully"});
                }
            });
        }) 

        app.put('/property/update_agent/:id', (req, res) => {
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                _id: ObjectId(req.params.id)
            }

            const newSet = {$set : {agent : req.body.agent} }
            
            propertyCollection.updateOne(query, newSet, {upsert:true}, (err, result) => {
                if (err) {
                    res.status(500).send({ message: 'An error has occurred'});
                } else {
                    res.status(200).send({message: "Updated successfully"});
                }
            });
        }) 

        app.get('/property/:email', (req, res) => {
            //let id = req.params.id;
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                //_id: ObjectId(req.params.id)
                email: req.params.email
            }
            
            propertyCollection.findOne(query, (err, result) => {
                if (result == null){
                    //console.log(err);
                    res.status(400).send();
                }
                else {
                    //console.log(result);
                    res.status(200).send(result);
                }
            });
            
        })

        //Property
        app.get('/property/:id', (req, res) => {
            //let id = req.params.id;
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                _id: ObjectId(req.params.id)
            }
            
            propertyCollection.findOne(query, (err, result) => {
                if (result == null){
                    //console.log(err);
                    res.status(400).send();
                }
                else {
                    //console.log(result);
                    res.status(200).send(result);
                }
            });
            
        })

        app.get('/prop/all', (req, res) => {
            
            propertyCollection.find({}).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                }
                else {
                    
                    res.status(200).send(result);
                    
                }
            })
        })

        //property create
        app.post('/property/create', (req, res) => {
            const body = req.body;
            propertyCollection.insertOne(body, (err, result) => {
                if(err){
                    const message = {
                        status: "Error",
                        message: "Error creating the property"
                    }
                    res.status(400).send()
                }
                else {
                    const message = {
                        status: "Success",
                        message: "Property registered successfully"
                    }
                    res.status(200).send(message);
                }
            })
            
        })

        //staff get all
        app.get('/staff/all', (req, res) => {
            
            staffCollection.find({}).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                }
                else {
                    console.log(result);
                    res.status(200).send(result);
                    console.log()
                }
            })
        })
        //staff create
        app.post('/staff/create', (req, res) => {
            const body = req.body;
            staffCollection.insertOne(body, (err, result) => {
                if(err){
                    const message = {
                        status: "Error",
                        message: "Error creating the staff"
                    }
                    res.status(400).send()
                }
                else {
                    const message = {
                        status: "Success",
                        message: "Staff record registered successfully"
                    }
                    res.status(200).send(message);
                }
            })
            
        })

        //blog get all
        app.get('/subscribers/all', (req, res) => {
            
            subscribersCollection.find({}).toArray((err, result) => {
                if (result == null){
                    res.status(400).send();
                }
                else {
                    console.log(result);
                    res.status(200).send(result);
                    console.log()
                }
            })
        })

        //Subscribers create
        app.post('/subscribers/create', (req, res) => {
            const body = req.body;
            subscribersCollection.insertOne(body, (err, result) => {
                if(err){
                    const message = {
                        status: "Error",
                        message: "Error creating the subscribers"
                    }
                    res.status(400).send()
                }
                else {
                    const message = {
                        status: "Success",
                        message: "Subscribers registered successfully"
                    }
                    res.status(200).send(message);
                }
            })
            
        })

        app.get('/subscribers/:id', (req, res) => {
            //let id = req.params.id;
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                _id: ObjectId(req.params.id)
            }
            
            subscribersCollection.findOne(query, (err, result) => {
                if (result == null){
                    //console.log(err);
                    res.status(400).send();
                }
                else {
                    //console.log(result);
                    res.status(200).send(result);
                }
            });
            
        })

        app.put('/subscribers/update_pname/:id', (req, res) => {
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                _id: ObjectId(req.params.id)
            }

            const newSet = {$set : {pname : req.body.pname, date: req.body.date} }
            
            subscribersCollection.updateOne(query, newSet, {upsert:true}, (err, result) => {
                if (err) {
                    res.status(500).send({ message: 'An error has occurred'});
                } else {
                    res.status(200).send({message: "Updated successfully"});
                }
            });
        }) 

        app.put('/subscribers/update_property/:id', (req, res) => {
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                _id: ObjectId(req.params.id)
            }

            const newSet = {$set : {punit : req.body.punit, price: req.body.price, agent: req.body.agent}}
           
            subscribersCollection.updateOne(query, newSet, {upsert:true}, (err, result) => {
                if (err) {
                    res.status(500).send({ message: 'An error has occurred'});
                } else {
                    res.status(200).send({message: "Updated successfully"});
                }
            });
        }) 

        app.put('/subscribers/update_personal/:id', (req, res) => {
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                _id: ObjectId(req.params.id)
            }

            const newSet = {$set : {lastname : req.body.lastname, othernames: req.body.othernames, email: req.body.email, phone: req.body.phone, address: req.body.address}}
           
            subscribersCollection.updateOne(query, newSet, {upsert:true}, (err, result) => {
                if (err) {
                    res.status(500).send({ message: 'An error has occurred'});
                } else {
                    res.status(200).send({message: "Updated successfully"});
                }
            });
        }) 

        app.put('/subscribers/update_kin/:id', (req, res) => {
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                _id: ObjectId(req.params.id)
            }

            const newSet = {$set : {kin_fullname : req.body.kin_fullname, kin_phone: req.body.kin_phone, kin_email: req.body.kin_email}}
           
            subscribersCollection.updateOne(query, newSet, {upsert:true}, (err, result) => {
                if (err) {
                    res.status(500).send({ message: 'An error has occurred'});
                } else {
                    res.status(200).send({message: "Updated successfully"});
                }
            });
        }) 

        app.put('/subscribers/update_upload/:id', (req, res) => {
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                _id: ObjectId(req.params.id)
            }

            const newSet = {$set : {upload : req.body.upload, upload2: req.body.upload2}}
           
            subscribersCollection.updateOne(query, newSet, {upsert:true}, (err, result) => {
                if (err) {
                    res.status(500).send({ message: 'An error has occurred'});
                } else {
                    res.status(200).send({message: "Updated successfully"});
                }
            });
        }) 

        app.put('/subscribers/update_status/:id', (req, res) => {
            const ObjectId  = require('mongodb').ObjectID;
            const query = {
                _id: ObjectId(req.params.id)
            }

            const newSet = {$set : {status: req.body.status}}
           
            subscribersCollection.updateOne(query, newSet, {upsert:true}, (err, result) => {
                if (err) {
                    res.status(500).send({ message: 'An error has occurred'});
                } else {
                    res.status(200).send({message: "Updated successfully"});
                }
            });
        }) 

        app.delete('/subscriber/delete/:id', (req, res) => {

            let id = req.params.id;
            var sid = new ObjectID(id);
            
            subscriberCollection.deleteOne({_id: sid}, (err, result) => {
                if (err){
                    res.status(400).send();
                }
                else {
                    res.status(200).send();
                }
            })
            
        })


        app.get('/', (req, res) => {
            console.log("First route working right");
            res.json({message: "This is the first message"})
        })

    }
});

app.listen(port, () => {
    console.log("Listening to my app, coming on port "+process.env.PORT || port);
});