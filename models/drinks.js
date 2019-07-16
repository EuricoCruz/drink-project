const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const drinkSchema = new Schema({
  name: {type: String, required: true,},
  ingredients: {type: Array, required: true,}, 
  photo: {type: String, required: true},
  recipe: String,
  type: {type: String, enum: ['alcoholic', 'non alcoholic'], required: true, }, 
  Owner: {type: String, default: 'public',}
}, {
  timestamps: true,
});

const Drink = mongoose.model("Drink", drinkSchema);

module.exports = Drink;