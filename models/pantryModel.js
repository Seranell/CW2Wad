const nedb = require('nedb');

class PantryModel {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new nedb({ filename: dbFilePath, autoload: true });
            console.log('DB connected to ' + dbFilePath);
        } else {
            this.db = new nedb();
        }
    }

    // Function to seed the database with initial perishable food items
    init() {
        this.db.insert({
            name: 'Apple',
            description: 'A juicy and delicious fruit.',
            category: 'Fruit',
            expiryDate: '21-04-2024',
            quantity: '10',
            image: 'https://www.collinsdictionary.com/images/full/apple_158989157.jpg' 
        });
        console.log('Perishable food item "Apple" inserted');
        
        this.db.insert({
            name: '1 Pint of Milk',
            description: 'Fresh dairy milk.',
            category: 'Dairy',
            expiryDate: '27-04-2024',
            quantity: '5',
            image: 'https://www.crumbsfoodco.com/wp-content/uploads/2019/12/1-pint-of-mik-2-small.jpg' 
        });
        console.log('Perishable food item "Milk" inserted');

        
    }

    // Returns perishable foods
    getAllPerishableFoods() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function(err, perishableFoods) {
                if (err) {
                    reject(err);
                } else {
                    resolve(perishableFoods);
                    console.log('getAllPerishableFoods() returns: ', perishableFoods);
                }
            });
        });
    }

    // Adds perishable foods
    addPerishableFood(name, description, category, expiryDate, image) {
        const perishableFood = {
            name: name,
            description: description,
            category: category,
            expiryDate: expiryDate,
            image: image
        };

        this.db.insert(perishableFood, function(err, doc) {
            if (err) {
                console.log('Error inserting perishable food item:', name);
            } else {
                console.log('Perishable food item inserted into the database:', doc);
            }
        });
    }

    // Get perishable food items by category
    getPerishableFoodsByCategory(category) {
        return new Promise((resolve, reject) => {
            this.db.find({ category: category }, function(err, perishableFoods) {
                if (err) {
                    reject(err);
                } else {
                    resolve(perishableFoods);
                    console.log('getPerishableFoodsByCategory() returns: ', perishableFoods);
                }
            });
        });
    }
}

module.exports = PantryModel;
