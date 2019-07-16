const mongoose = require('mongoose');
const Drink = require('./models/drinks');
const dbtitle = 'drink-project';
mongoose.connect(`mongodb://localhost/${dbtitle}`);
Drink.collection.drop();

const drinks = [
  {
    name: 'Caipirinha de limão com cachaça', 
    ingredients: [ '2 colheres de açucar', '1 limão', '5 cls de cachaça'],
    photo: "xxx", 
    recipe: 'Em um copo de tamanho médio despeje as duas colheres de açucar. Corte o limão ao meio e retire o miolo de ambas as partes para evitar a amargura. Use um socador para para espremer os limões junto ao açucar. Coloque gelo até a boca e despeje a cachaça. Com uma colher, misture a bebida buscando trazer o açucar para cima. Sirva', 
    type: 'alcoholic' 
  }, {
    name: 'Margarita', 
    ingredients: [ '5 cls de Tequila', '2 cls de curaçau','2 cls de suco de limão'],
    photo: "xdx", 
    recipe: 'Misture tudo em uma coqueteleira e sirva em um copo cocktail. Passe um limão na borda do copo para encrustar açucar. Sirva',
    type: 'alcoholic' 
  },
  {
    name: 'Coquetel de Frutas', 
    ingredients: [ '3 cls de suco de laranja', '3cls de suco de abacaxi','3 cls de suco de caju', '3 cl de leite condesado'],
    photo: "xdx", 
    recipe: 'Misture tudo em uma coqueteleira e sirva em uma taça flutê.',
    type: 'non alcoholic' 
  },
]


Drink.create(drinks, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${drinks.length} drinks`)
  mongoose.connection.close();
});