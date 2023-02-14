const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let dataSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  numberOfWaterings: {
    type: Number,
  },
});

let Data = mongoose.model("data", dataSchema);

module.exports = Data;
