const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const drinkSchema = new Schema({
  name: { type: String, required: true },
  ingredients: {type: Array, required: true,}, 
  photo: {type: String},
  recipe: String,
  type: { type: String, enum: ['alcoholic', 'non alcoholic'], required: true }, 
  owner: { type: Schema.Types.ObjectId, ref: "User" },
}, {
  timestamps: true,
});

const Drink = mongoose.model("Drink", drinkSchema);

module.exports = Drink;