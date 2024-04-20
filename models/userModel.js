const Datastore = require("nedb");
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            // Use the provided database file path
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
        } else {
            // Use the default database file path
            this.db = new Datastore({ filename: 'users.db', autoload: true });
        }
    }

    // Initialize method to insert demo users
    init() {
        this.db.insert({
            user: 'Peter',
            password: '$2b$10$I82WRFuGghOMjtu3LLZW9OAMrmYOlMZjEEkh.vx.K2MM05iu5hY2C',
            role: "user"
        });
        this.db.insert({
            user: 'Ann',
            password: '$2b$10$bnEYkqZM.MhEF/LycycymOeVwkQONq8kuAUGx6G5tF9UtUcaYDs3S',
            role: "user"
        });
        
        this.db.insert({
            user: 'Admin',
            password: '$2b$10$bnEYkqZM.MhEF/LycycymOeVwkQONq8kuAUGx6G5tF9UtUcaYDs3S',
            role: 'admin'
        });
        return this;
    }

    // Method to create a new user
    create(username, password) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function(hash) {
            var entry = {
                user: username,
                password: hash,
            };
            that.db.insert(entry, function (err) {
                if (err) {
                    console.log("Can't insert user: ", username);
                }
            });
        });
    }

    delete(username, cb) {
        this.db.remove({ 'user': username }, { multi: true }, function (err, numRemoved) {
            if (err) {
                console.log("Error deleting user: ", username);
                return cb(err);
            }
            console.log("Deleted user: ", username);
            return cb(null, numRemoved);
        });
    }
    getAllUsers(cb) {
        this.db.find({}, function (err, users) {
            if (err) {
                console.error("Error fetching users:", err);
                return cb(err);
            }
            return cb(null, users);
        });
    }

    
    lookup(user, cb) {
        this.db.find({'user': user}, function (err, entries) {
            if (err) {
                return cb(null, null);
            } else {
                if (entries.length == 0) {
                    return cb(null, null);
                }
                return cb(null, entries[0]);
            }
        });
    }
}



// Initialize and export the DAO instance
const dao = new UserDAO('users.db');
dao.init();

module.exports = dao;
