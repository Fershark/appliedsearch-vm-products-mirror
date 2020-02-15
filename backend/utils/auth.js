var admin = require('firebase-admin');
const User = require('../models/User');

const isAuthenticated = (req, res, next) => {
  if (req.get("Authorization") == null) {
    res.status(401).json({
      message: "You need to provide the jwt token in the Authorization field in the header"
    });
    return;
  }
  const token = req.get("Authorization");
  admin.auth().verifyIdToken(token)
    .then(user => {

      User.findUserById(user.uid)
        .then(([rows, fields]) => {

          if (rows.length != 1)
            throw new Error("Cannot find user in database");

          req.user = rows[0];
          // console.log(req.user);
          next();
        }).catch(err => {
          console.log(err);
          res.status(401).json({
            message: "Invalid token"
          });
        });

    }).catch(function (error) {
      console.log(error);
      res.status(401).json({
        message: "Invalid token"
      });
    });
};

module.exports = isAuthenticated;