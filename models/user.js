const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String,},
  name: String,
  password: {type: String,}, 
  email: {type: String,},
  photo: String,
  phone: Number,
  role: {type: String, enum: ['bartender', 'drinker', 'admin'], default: 'drinker'},
  age: {type: Number,}, 
  city: String, 
  profession: String,
  confirmationCode: {type: String, unique: true},
  googleID: String,
}, {
  timestamps: {createdAt: "created_at", updatedAt: "update_at"},
});

const User = mongoose.model("User", userSchema);

module.exports = User;