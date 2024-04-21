const pantryDAO = require("../models/pantryModel");
const donationDAO = require("../models/donationModel");
const userDao = require("../models/userModel.js");
const path = require('path');
const multer = require('multer');

const db = new pantryDAO('./data/pantry');
db.init();

const donationsDB = new donationDAO('./data/donations');
donationsDB.init();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
}; 

exports.show_login = function (req, res) {
  res.render("user/login");
};

exports.handle_login = function (req, res) {
  res.render("home2", {
    title: "Home",
    user: "user"
  });
};

exports.show_new_entries = function (req, res) {
  res.render("newEntry", {
    title: "Guest Book",
    user: "user",
  });
};

exports.post_new_entry = function (req, res) {
  if (!req.body.author) {
    response.status(400).send("Entries must have an author.");
    return;
  }
  db.addEntry(req.body.author, req.body.subject, req.body.contents);
  res.redirect("/loggedIn");
};

exports.show_user_entries = function (req, res) {
  let user = req.params.author;
  db.getEntriesByUser(user)
    .then((entries) => {
      res.render("entries", {
        title: "Guest Book",
        user: "user",
        entries: entries,
      });
    })
    .catch((err) => {
      console.log("Error: ");
      console.log(JSON.stringify(err));
    });
};

exports.show_register_page = function (req, res) {
  res.render("user/register");
};

exports.post_new_user = function (req, res) {
  const user = req.body.username;
  const password = req.body.pass;

  if (!user || !password) {
    res.send(401, "no user or no password");
    return;
  }
  userDao.lookup(user, function (err, u) {
    if (u) {
      res.send(401, "User exists:", user);
      return;
    }
    userDao.create(user, password);
    console.log("register user", user, "password", password);
    res.redirect("/login");
  });
};

exports.loggedIn_landing = function (req, res) {
  db.getAllEntries()
    .then((list) => {
      res.render("entries", {
        title: "Guest Book",
        user: "user",
        entries: list,
      });
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

exports.logout = function (req, res) {
  res.clearCookie("jwt").status(200).redirect("/");
};

exports.landing_page = function(req, res) {
  res.render('home1', {
      'title': 'home',
  });
};

exports.home2 = function(req, res){
  res.render('home2', {
    'title': 'home'
  })
};

exports.contact = function(req, res) {
  res.render('contact', {
      'title': 'Contact Us'
  });
};

exports.contactUs = function(req, res) {
  res.render('contact2', {
    'title': 'Contact Us'
  });
};

exports.catelogueP = function(req, res) {
  db.getAllPerishableFoods()
    .then((list) => {
      res.render("catelogueP", {
        title: "Perishable Food Catalogue",
        entries: list,
      });
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

exports.catelogueNP = function(req, res) {
  res.render('catelogueNP', {
    'title': 'Non-Perishable Catelogue'
  });
};

exports.show_add_item_page = function(req, res) {
  res.render('additem', {
    title: 'Add Item',
    user: req.user
  });
};

exports.add_new_item = function(req, res) {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.status(400).send('Error uploading image');
    } else {
      const { name, description, category, expiryDate } = req.body;
      const image = '/uploads/' + req.file.filename;

      return db.addPerishableFood(name, description, category, expiryDate, image)
        .then(() => {
          console.log('Item added successfully');
          res.redirect('/catelogueP');
        })
        .catch((err) => {
          console.log('Error adding item:', err);
          res.status(500).send('Error adding item');
        });
    }
  });
};

exports.remove_expired_items = function(req, res) {
  db.removeExpiredItems();
  res.send('Expired items removed.');
};

exports.about = function(req, res) {
  res.render('about', {
    'title': 'About Us'
  });
};

exports.aboutUs = function(req, res) {
  res.render('about2', {
    'title': 'About Us'
  });
};

exports.account = function(req, res) {
  res.render('account', {
    'title': 'My Account'
  });
};

exports.adminPage = function(req, res){
  const username = req.body.username;
  res.render('admin/adminPage',{
    'title' : 'Admin page',
    username: username
  } );
};

exports.cateloguePA = function(req, res) {
  db.getAllPerishableFoods()
    .then((list) => {
      res.render("admin/cateloguePA", {
        title: "Perishable Food Catalogue",
        entries: list,
      });
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

exports.deleteSelectedItem = function(req, res) {
  const itemId = req.params.itemId;
  db.deleteSelectedItem(itemId)
    .then(() => {
      res.redirect('admin/CateloguePA'); 
    })
    .catch((err) => {
      console.error('Error deleting item:', err);
      res.status(500).send('Error deleting item');
    });
};

exports.addPantry = function(req, res){
  res.render('admin/addPantry',{
    'title' : 'Add User'
  } );
};

exports.admin_post_new_user = function (req, res) {
  const user = req.body.username;
  const password = req.body.pass;
  const role = req.body.role;

  if (!user || !password) {
    res.send(401, "no user or no password");
    return;
  }
  userDao.lookup(user, function (err, u) {
    if (u) {
      res.send(401, "User exists:", user);
      return;
    }
    userDao.create(user, password,role);
  });
  res.render("admin/pantryAdded");
};

exports.show_delete_user_page = function(req, res) {
  userDao.getAllUsers(function(err, users) {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).send("Error fetching users");
      return;
    }
    res.render("admin/deletePantry", { users: users });
  });
};

exports.confirm_delete_user = function(req, res) {
  const username = req.body.username;

  userDao.delete(username, function(err, numRemoved) {
    if (err) {
      console.error("Error deleting user:", err);
      res.status(500).send("Error deleting user");
      return;
    }
    if (numRemoved > 0) {
      res.render("admin/pantryDeleted");
    } else {
      res.status(404).send("User not found");
    }
  });
};

exports.show_pantry_home = function(req, res){
  res.render('pantry/pantryHome',{
    'title' : 'Home'
  });
};

exports.cateloguePpantry = function(req, res) {
  db.getAllPerishableFoods()
    .then((list) => {
      res.render("pantry/catelogueP1", {
        title: "Perishable Food Catalogue",
        entries: list,
      });
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

exports.accountP = function(req, res) {
  donationsDB.getAllDonations()
    .then((list) => {
      res.render("pantry/accountP", {
        title: "Account",
        donations: list,
      });
    })
    .catch((err) => {
      console.log("Error fetching donations:", err);
      res.status(500).send("Internal Server Error");
    });
};

exports.donateItem = function(req, res) {
  const itemId = req.params.itemId;

  db.getPerishableFoodById(itemId)
    .then((item) => {
      donationsDB.addDonation(item)
        .then(() => {
          db.deleteSelectedItem(itemId)
            .then(() => {
              console.log('Item removed from original database after donation');
              res.redirect('/accountP'); 
            })
            .catch((err) => {
              console.error('Error removing item from original database:', err);
              res.status(500).send('Internal Server Error');
            });
        })
        .catch((err) => {
          console.log("Error adding donation:", err);
          res.status(500).send("Internal Server Error");
        });
    })
    .catch((err) => {
      console.log("Error retrieving item from pantry:", err);
      res.status(500).send("Internal Server Error");
    });
};
