//pantryModel
const nedb = require('nedb');
const path = require('path');

class PantryModel {
    constructor(dbFilePath) {
        const fullPath = path.join(__dirname, dbFilePath + '.db');
        this.db = new nedb({ filename: fullPath, autoload: true });
        console.log('DB connected to ' + fullPath);
    }

    // Checks if database has items and adds them if not
    init() {
        
        this.db.findOne({ name: 'Apple' }, (err, doc) => {
            if (err) {
                console.error('Error checking database:', err);
                return;
            }
            
            if (doc) {
                console.log('Database has already been seeded.');
                return;
            }
            
            this.seedDatabase();
        });
    }

    // Automaticlly add items to Database
    seedDatabase() {
        this.db.insert({
            name: 'Apple',
            description: 'A juicy and delicious fruit.',
            category: 'Fruit',
            expiryDate: '2024-04-21',
            quantity: '10',
            image: 'https://www.collinsdictionary.com/images/full/apple_158989157.jpg' 
        });
        console.log('Perishable food item "Apple" inserted');
        
        this.db.insert({
            name: '1 Pint of Milk',
            description: 'Fresh dairy milk.',
            category: 'Dairy',
            expiryDate: '2024-04-27',
            quantity: '5',
            image: 'https://www.crumbsfoodco.com/wp-content/uploads/2019/12/1-pint-of-mik-2-small.jpg' 
        });
        console.log('Perishable food item "Milk" inserted');
    }

    // Removes expired food
    removeExpiredItems() {
        const currentDate = new Date().toISOString(); 
        this.db.remove({ expiryDate: { $lt: currentDate } }, { multi: true }, (err, numRemoved) => {
            if (err) {
                console.error('Error removing expired items:', err);
            } else {
                console.log(numRemoved + ' expired items removed from the database.');
            }
        });
    }

    // Adds perishable foods
    addPerishableFood(name, description, category, expiryDate, image, quantity = 1) {
        const perishableFood = {
            name: name,
            description: description,
            category: category,
            expiryDate: expiryDate,
            image: image,
            quantity: quantity
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
