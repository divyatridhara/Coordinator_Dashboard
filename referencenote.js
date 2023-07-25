const mongoose = require('mongoose')

const referencenote = new mongoose.Schema({
    CourseId:{
        type:String,
        required:true
    },
     Topicname : {                 
        type : String,
        required : true
    },
    Explanation: {
        type : String,
        required : true
    },
    ResourceLinks:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('referencenote',referencenote)