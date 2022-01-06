const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)

  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany()
  })

  // Run your code here, after you have insured that the connection was made

  .then(() => {
    (async function loadAllPromises() {

      try {
        await Recipe.create({
          title: "Cantonese Rice",
          level: "Amateur Chef",
          ingredients: [
            "rice",
            "ham",
            "2 eggs",
            "peas",
            "soy sauce"
          ],
          cuisine: "cantonese",
          dishType: "main_course",
          image: "https://static.jow.fr/recipes/ZUYhchklCR7EJg.jpg",
          duration: 30,
          creator: "Tom",
        })

        const allRecipes = await Recipe.insertMany(data);
        allRecipes.forEach(recipe => console.log(recipe.title));

        const findOneUpdate = await Recipe.findOneAndUpdate({ title: 'Rigatoni alla Genovese' }, { duration: 100 });
        console.log('Recipe successfully updated');

        const removeRecipe = await Recipe.deleteOne({ name: "Carrot Cake" });

        const closeDatabase = await mongoose.connection.close(() => {
          console.log('Mongoose disconnected on app termination');
          process.exit(0);
        });

      } catch (error) {
        console.error(error);
      }
    })();
  })

  .catch(error => {
    console.error('Error connecting to the database', error);
  });
