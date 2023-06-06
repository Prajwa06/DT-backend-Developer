const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  type: String,
  uid: Number,
  name: String,
  tagline: String,
  schedule: String,
  description: String,
  files: Array,
  moderator: String,
  category: String,
  sub_category: String,
  rigor_rank: Number,
  attendees: Array,
  rigor_rank:String,
});

const EventModel = mongoose.model("event", EventSchema);

module.exports = EventModel;
