const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let  dataSchema = new Schema(
  {
    name: {
        type: String,
        required: true,
        unique: true
      },
    numberOfWaterings: {
      type: Array,
    },
  },

);

let Data = mongoose.model("data", dataSchema);

module.exports = Data;