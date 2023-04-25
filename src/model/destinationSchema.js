const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  Account_Id: {
    type: String,
    unique: true,
  },
  destination: [
    {
      house: String,
      door: Number,
      street: String,
    },
  ],
});

module.exports = mongoose.model("user_address", destinationSchema);
