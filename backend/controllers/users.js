// place the users logic here
const User = require('../models/user');
const Item = require('../models/item');
const Booking = require('../models/booking');

const { firebaseAdmin } = require('../util/firebase');
const Utils = require('../util/utils');

exports.getAllUsers = (req, res, next) => {
  if (req.user == null) {
    res.status(400).json({
      message: "The user should be provided, add the callback to the router to check if the user is logged"
    });
    return;
  }
  // we use promise which is nicer than callback
  User.findUserByEmail(req.user.email)
    .then(doc => {
      res.status(200).json(doc.data());
    }).catch(err => {
        console.log(err);
    });
};

exports.create = (req, res, next) => {
  console.log("register user");
  if (!req.body.email || 
    !req.body.password || 
    !req.body.address ||
    !req.body.lat ||
    !req.body.lng ||
    !req.body.username) {
    return res.status(400).send({
      success: 'false',
      message: 'email, password, username, address, lat, lnf are required',
    });
  }
  const user = req.body;
  user.isAdmin = false;
  user.isActive = true;
  firebaseAdmin.auth().createUser(user).then(userRecord => {
    delete user.password;
    User.saveUser(user).then(resultData => {
      user.uid = userRecord.uid;
      res.status(201).json(user);
    }).catch(err => {
      res.status(400).json({
        message: "unable to create record"
      });
    });
  }).catch(err => {
    console.log(err);
    let status = 400;
    if (err != null && err.errorInfo != null && err.errorInfo.code == 'auth/email-already-exists')
      status = 409;
    res.status(status).json({
      message: err.errorInfo.message
    });
  });
};

exports.getAllItemsOfUser = (req, res, next) => {
  if (req.user == null) {
    res.status(400).json({
      message: "The user should be provided, add the callback to the router to check if the user is logged"
    });
    return;
  }
  // we use promise which is nicer than callback
  Item.findAllItemsOfUser(req.user.email)
    .then(([rows, fields]) => {
      rows.forEach((currentValue, index, array) => {
        Utils.toBoolean(currentValue, 'isActive');
        array[index] = currentValue;
      });
      res.status(200).json(rows);
    }).catch(err => {
        console.log(err);
    });
};

exports.edit = (req, res, next) => {
  if (req.user == null) {
    res.status(400).json({
      message: "The user should be provided, add the callback to the router to check if the user is logged"
    });
    return;
  }
  const user = req.body;
  User.saveUser(user).then(resultData => {
      res.status(200).json(user);
    }).catch(err => {
      console.log(err);
      res.status(400).json({
        message: "Bad request"
      });
    });
};

exports.getWishlistOfUser = (req, res, next) => {
  if (req.user == null) {
    res.status(400).json({
      message: "The user should be provided, add the callback to the router to check if the user is logged"
    });
    return;
  }

  // we use promise which is nicer than callback
  Item.findWishlistOfUser(req.user.email)
    .then(([rows, fields]) => {
      rows.forEach((currentValue, index, array) => {
        Utils.toBoolean(currentValue, 'isActive');
        array[index] = currentValue;
      });
      res.status(200).json(rows);
    }).catch(err => {
        console.log(err);
    });
};

exports.getBookingsOfUser = (req, res, next) => {
  if (req.user == null) {
    res.status(400).json({
      message: "The user should be provided, add the callback to the router to check if the user is logged"
    });
    return;
  }

  Booking.findAllBookingOfUser(req.user.email)
  .then(([rows, fields]) => {
      rows.forEach((currentValue, index, array) => {
            Utils.toBoolean(currentValue, 'isActive');
            array[index] = currentValue;
          });
      res.status(200).json(rows)
  }).catch(err => {
      console.log(err);
  });

  // we use promise which is nicer than callback
  // Item.findWishlistOfUser(req.user.email)
  //   .then(([rows, fields]) => {
  //     rows.forEach((currentValue, index, array) => {
  //       Utils.toBoolean(currentValue, 'isActive');
  //       array[index] = currentValue;
  //     });
  //     res.status(200).json(rows);
  //   }).catch(err => {
  //       console.log(err);
  //   });
};

exports.getRequestsOfUser = (req, res, next) => {
  if (req.user == null) {
    res.status(400).json({
      message: "The user should be provided, add the callback to the router to check if the user is logged"
    });
    return;
  }

  Booking.findAllRequestOfUser(req.user.email)
  .then(([rows, fields]) => {
      rows.forEach((currentValue, index, array) => {
            Utils.toBoolean(currentValue, 'isActive');
            array[index] = currentValue;
          });
      res.status(200).json(rows)
  }).catch(err => {
      console.log(err);
  });

};