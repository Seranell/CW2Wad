//pantryModel
const nedb = require('nedb');
const path = require('path');

class PantryModel {
    constructor(dbFilePath) {
        const fullPath = path.join(__dirname, dbFilePath + '.db');
        this.db = new nedb({ filename: fullPath, autoload: true });
        console.log('DB connected to ' + fullPath);
    }

    // Function to seed the database with initial perishable food items
    init() {
        // Check if the database has already been seeded
        this.db.findOne({ name: 'Apple' }, (err, doc) => {
            if (err) {
                console.error('Error checking database:', err);
                return;
            }
            // If the item 'Apple' is found, database has already been seeded
            if (doc) {
                console.log('Database has already been seeded.');
                return;
            }
            // If 'Apple' is not found, seed the database
            this.seedDatabase();
        });
    }

    // Seed the database with initial perishable food items
    seedDatabase() {
        // Insert initial perishable food items here
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


    // Adds perishable foods
    addPerishableFood(name, description, category, expiryDate, image, quantity = 1) {
        const perishableFood = {
            name: name,
            description: description,
            category: category,
            expiryDate: expiryDate,
            image: image,
            quantity: quantity  // Make quantity optional, default to 0 if not provided
        };
    
        return new Promise((resolve, reject) => {
            this.db.insert(perishableFood, function(err, doc) {
                if (err) {
                    console.log('Error inserting perishable food item:', err);
                    reject(err);
                } else {
                    console.log('Perishable food item inserted into the database:', doc);
                    resolve(doc);
                }
            });
        });
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
