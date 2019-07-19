const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const drinkSchema = new Schema({
  name: { type: String, required: true },
  photo: {type: String},
  recipe: String,
  type: { type: String, enum: ['Alcólico', 'Não Alcólico'], required: true }, 
  owner: { type: Schema.Types.ObjectId, ref: "User" },
}, {
  timestamps: true,
});

const Drink = mongoose.model("Drink", drinkSchema);

module.exports = Drink;