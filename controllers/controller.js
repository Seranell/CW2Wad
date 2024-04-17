
exports.landing_page = function(req, res) {
            res.render('home1', {
                'title': 'home',
            })
}
exports.contact = function(req, res) {
    res.render('contact', {
    'title': 'Contact Us'
    })
}
exports.catelogueP = function(req, res) {
    res.render('catelogueP', {
    'title': 'Perishable Catelogue'
    })
}
exports.catelogueNP = function(req, res) {
    res.render('catelogueNP', {
    'title': 'Non-Perishable Catelogue'
    })
}
exports.additem = function(req, res) {
    res.render('additem', {
    'title': 'Add item'
    })
}
exports.about = function(req, res) {
    res.render('about', {
    'title': 'About Us'
    })
}
exports.account = function(req, res) {
    res.render('account', {
    'title': 'My Account'
    })
}
