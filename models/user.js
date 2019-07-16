const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true,}, 
  email: {type: String, required: true},
  // photo: {type: String, required: true},
  role: {type: String, enum: ['bartender', 'drinker'], required: true, default: 'drinker'},
  age: Number, 
}, {
  timestamps: {createdAt: "created_at", updatedAt: "update_at"},
});

const User = mongoose.model("User", userSchema);

module.exports = User;