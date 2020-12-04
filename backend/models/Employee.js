const mongoose = require('mongoose');

const PersonSchema = mongoose.Schema({
   name: {
       type: String,
       require: true
   },
    salary: {
       type: Number,
       require: true
   },
    age: {
       type: Number,
       require: true
   }
});

module.exports = mongoose.model('Data', PersonSchema)