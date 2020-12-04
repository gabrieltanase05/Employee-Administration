const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./models/Employee');
const router = express.Router();
require('dotenv/config');

app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));
app.use('/api', router);

//Listening Server
app.listen(8080);

//Connect to db.mongo
mongoose.connect(
    process.env.DB_CONNECTION,
    {   useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },

    ()=> console.log('Connection to db!')

);

//Check the connection to db.mongo
mongoose.connection.on('error', console.error.bind(console, 'Error connection to MongoDB'))

//Routes(METHODS: app.GET, POST, PARCH, DELETE)
//GET Method
router.get('/GET',(req, res)=>{
        Data.find((err, data)=>{
            if(err) {
                res.json({success: false, error: err});
            } else {
                res.json({success: true, data: data});
            }
        });

});

//POST Method- Post the data from CRUD to Mongo.db
router.post('/POST', (req, res) => {
    const data = new Data();
    const {name, salary, age} = req.body

    data.name = name;
    data.salary = salary;
    data.age = age;
    data.save((err) => {
        if (err){
            res.json({success: false, error: err});
        } else {
            res.json({success: true, data:data});
        }

    });
})

//DELETE Method- DELETE the data from  Mongo.db
router.delete('/DELETE', (req, res)=>{
    const {id} = req.body;
    Data.findByIdAndRemove(id, err =>{
        if (err){
            res.send(err);
        } else {
            res.json({ success: true });
        }

    })
})

//UPDATE Method- UPDATE data objects from  Mongo.db
router.post('/UPDATE', (req, res)=>{
    const{id, name, salary, age} = req.body;
    Data.findByIdAndUpdate(id,{$set:{name: name, salary: salary, age: age}}, (err)=>{
        if (err){
            res.json({success: false, error: err});
        } else {
            res.json({success: true});
        }
    })
})


