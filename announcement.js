const mongoose = require('mongoose')
const schema = mongoose.Schema;

const announcementSchema = new schema({
    announcement: String
  },
  {
    collection:"announcements"
  });
  

const anouncementmodel = mongoose.model("announcements",announcementSchema);

module.exports = anouncementmodel