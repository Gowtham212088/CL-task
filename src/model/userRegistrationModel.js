const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  Account_Id: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  destination: {
    address: {
      type: String,
      required: true
    },},
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("create_users", userSchema);
