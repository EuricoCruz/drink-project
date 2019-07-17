const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  name: String,
  password: {type: String, required: true,}, 
  email: {type: String, required: true},
  photo: String,
  phone: Number,
  role: {type: String, enum: ['bartender', 'drinker', 'admin'], required: true, default: 'drinker'},
  age: {type: Number, required: true}, 
  city: String, 
  profession: String,
  confirmationCode: {type: String, unique: true},
}, {
  timestamps: {createdAt: "created_at", updatedAt: "update_at"},
});

const User = mongoose.model("User", userSchema);

module.exports = User;