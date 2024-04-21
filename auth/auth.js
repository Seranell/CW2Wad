const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.login = function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    userModel.lookup(username, function(err, user) {
        if (err) {
            console.log("error looking up user", err);
            return res.status(401).send();
        }
        if (!user) {
            console.log("user ", username, " not found");
            return res.render("user/register");
        }

        bcrypt.compare(password, user.password, function (err, result) {
          if (result) {
            let payload = { username: username, role: user.role };
            let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
              expiresIn: 300,
            });
            res.cookie("jwt", accessToken);
    
            if (payload.role == "admin") {
              return res.render("admin/adminPage", {
                title: "Admin Page",
                user: "user",
              });
            }
            if (payload.role == "pantry") {
              return res.render("pantry/pantryHome", {
                title: "Pantry Home",
                user: "user",
              });
            }
            if (payload.role == "user") {
              return res.render("home2", {
                title: "home",
                user: "user",
              });
            }
            next();
          } else {
            return res.render("user/login");
          }
        });
      });
    };

exports.verify = function(req, res, next) {
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
        return res.status(403).send();
    }
    let payload;
    try {
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        next();
    } catch (e) {
        res.status(401).send();
    }
};
exports.verifyPantry = function(req, res, next) {
  let accessToken = req.cookies.jwt;
  if (!accessToken) {
      return res.status(403).send();
  }
  let payload;
  try {
      payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      if (payload.role !== "pantry") {
          return res.status(403).send();
      }
      next();
  } catch (e) {
      res.status(401).send(); 
  }
};
exports.verifyAdmin = function(req, res, next) {
  let accessToken = req.cookies.jwt;
  let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  if (payload.role !== "admin") {
      return res.status(403).send();
  }
  next();
};