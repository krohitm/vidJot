const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Define the schema
const IdeaSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  details:{
    type: String,
    required: true
  },
  data:{
    type: Date,
    default: Date.now
  }
})

mongoose.model('ideas', IdeaSchema);