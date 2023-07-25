const mongoose = require('mongoose')

const team = new mongoose.Schema({
    teamnumber: {
        type: Number,
        required: true,
          },
    teamname: {
        type: String,
        required: true,
    },
    mentor: {
      type: String,
      required: true,
    },
    numberofstudents:{
        type: Number,
        required: true,
        default: 0
    }

});


module.exports=mongoose.model('team',team)