//routes
const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.js');
const {login} = require('../auth/auth')
const {verify} = require('../auth/auth')

router.get('/login', controller.show_login);
router.post('/login', login, controller.handle_login);
router.get("/", controller.landing_page);
router.get('/new',verify,controller.show_new_entries);
router.post('/new', verify, controller.post_new_entry);
router.get('/register', controller.show_register_page);
router.post('/register', controller.post_new_user);
router.get("/loggedIn",verify, controller.loggedIn_landing);
router.get("/logout", controller.logout);

router.get('/catelogueP', controller.catelogueP);
router.get('/catelogueNP', controller.catelogueNP);
router.get('/additem', verify, controller.show_add_item_page);
router.post('/additem', verify, controller.add_new_item);
router.get('/about', controller.about);
router.get('/aboutUs',verify, controller.aboutUs);
router.get('/contact', controller.contact);
router.get('/contactus',verify, controller.contactUs);
router.get('/account', controller.account);

router.use(function(req, res) {
        res.status(404);
        res.type('text/plain');
        res.send('404 Not found.');
    });
router.use(function(err, req, res, next) {
        res.status(500);
        res.type('text/plain');
        res.send('Internal Server Error.');
    });
module.exports = router;