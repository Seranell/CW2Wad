const nedb = require('nedb');
const path = require('path');

class DonationModel {
    constructor(dbFilePath) {
        const fullPath = path.join(__dirname, dbFilePath + '.db');
        this.db = new nedb({ filename: fullPath, autoload: true });
        console.log('DB connected to ' + fullPath);
    }

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
            
            this.populateDonationsDatabase();
        });
    }
populateDonationsDatabase(){
        this.db.insert({
            name: 'Apple',
            description: 'A juicy and delicious fruit.',
            category: 'Fruit',
            expiryDate: '2024-04-21',
            quantity: '10',
            expectedArrival: '2024-04-30',
            image: 'https://www.collinsdictionary.com/images/full/apple_158989157.jpg' 
        });
        console.log('Perishable food item "Apple" inserted');
        
        this.db.insert({
            name: '1 Pint of Milk',
            description: 'Fresh dairy milk.',
            category: 'Dairy',
            expiryDate: '2024-04-27',
            quantity: '5',
            expectedArrival: '2024-05-19',
            image: 'https://www.crumbsfoodco.com/wp-content/uploads/2019/12/1-pint-of-mik-2-small.jpg' 
        });
        console.log('Perishable food item "Milk" inserted');
    }
    getAllDonations() {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err, donations) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(donations);
                }
            });
        });
    }

    addDonation(item) {
        return new Promise((resolve, reject) => {
            this.db.insert(item, (err, newDoc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newDoc);
                }
            });
        });
    }

}


module.exports = DonationModel;