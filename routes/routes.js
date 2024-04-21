//routes
const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.js');
const auth = require('../auth/auth.js');

//login/register
router.get('/login', controller.show_login);
router.post('/login', auth.login, controller.handle_login);
router.get("/", controller.landing_page);
router.get('/new',auth.verify,controller.show_new_entries);
router.post('/new', auth.verify, controller.post_new_entry);
router.get('/register', controller.show_register_page);
router.post('/register', controller.post_new_user);
router.get("/loggedIn",auth.verify, controller.loggedIn_landing);
router.get("/logout", controller.logout);

//Regular User routes
router.get('/catelogueP' ,controller.catelogueP);
router.get('/catelogueNP', controller.catelogueNP);
router.get('/additem', auth.verify, controller.show_add_item_page);
router.post('/additem', auth.verify, controller.add_new_item);
router.get('/about', controller.about);
router.get('/aboutUs',auth.verify, controller.aboutUs);
router.get('/contact', controller.contact);
router.get('/contactus',auth.verify, controller.contactUs);
router.get('/account', controller.account);
//removes all expired food
router.get('/remove',auth.verifyAdmin, controller.remove_expired_items);

//Admin routes
router.get('/adminpage',auth.verifyAdmin, controller.adminPage);
router.get('/addpantry',auth.verifyAdmin, controller.addPantry);
router.post("/adminPostNewPantry",auth.verifyAdmin, controller.admin_post_new_user);
router.get('/cateloguePA', auth.verifyAdmin, controller.cateloguePA);
router.get('/deleteuser', auth.verifyAdmin, controller.show_delete_user_page);
router.post('/confirmdelete', auth.verifyAdmin, controller.confirm_delete_user);
router.post('/removeItem/:id', auth.verifyAdmin, controller.removeItem);

router.get('/pantryhome', auth.verifyPantry, controller.show_pantry_home);
//error handle
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