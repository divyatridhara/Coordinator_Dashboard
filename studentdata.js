const mongoose = require('mongoose')

const studentdata = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
          },
    mail: {
        type: String,
        required: true,
    },
    section: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    campus: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    teamnumber: {
      type: Number,
      required: true,
    },
    rollnumber: {
      type:String,
      required: true,
    },
    mentor: {
      type: String,
      required: true,
      }
    
    


});


module.exports=mongoose.model('studentdata',studentdata)