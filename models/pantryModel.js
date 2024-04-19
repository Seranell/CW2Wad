const nedb = require('nedb');

class FoodItems {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new nedb({ filename: dbFilePath, autoload: true });
            console.log('DB connected to ' + dbFilePath);
        } else {
            this.db = new nedb();
        }
    }

    // Function to seed the database with initial food items
    init() {
        this.db.insert({
            name: 'Apple',
            description: 'A juicy and delicious fruit.',
            category: 'Fruit',
            published: '2020-02-16'
        });
        console.log('Food item "Apple" inserted');

        this.db.insert({
            name: 'Spaghetti Bolognese',
            description: 'Classic Italian pasta dish with tomato sauce and minced meat.',
            category: 'Pasta',
            published: '2020-02-18'
        });
        console.log('Food item "Spaghetti Bolognese" inserted');
    }

    // Function to return all food items from the database
    getAllFoodItems() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function(err, foodItems) {
                if (err) {
                    reject(err);
                } else {
                    resolve(foodItems);
                    console.log('getAllFoodItems() returns:', foodItems);
                }
            });
        });
    }

    // Function to add a new food item
    addFoodItem(name, description, category) {
        const foodItem = {
            name: name,
            description: description,
            category: category,
            published: new Date().toISOString().split('T')[0]
        };

        this.db.insert(foodItem, function(err, doc) {
            if (err) {
                console.log('Error inserting food item:', name);
            } else {
                console.log('Food item inserted into the database:', doc);
            }
        });
    }

    // Function to get food items by category
    getFoodItemsByCategory(category) {
        return new Promise((resolve, reject) => {
            this.db.find({ category: category }, function(err, foodItems) {
                if (err) {
                    reject(err);
                } else {
                    resolve(foodItems);
                    console.log('getFoodItemsByCategory() returns:', foodItems);
                }
            });
        });
    }
}

module.exports = FoodItems;
