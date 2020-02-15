// place the users logic here
const User = require('../models/User');

const {
  firebaseAdmin
} = require('../utils/firebase');

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

exports.create = async (req, res, next) => {
  
  console.log("register user");
  if (!req.body.email ||
    !req.body.password ||
    !req.body.address ||
    !req.body.name ||
    !req.body.phone) {
    return res.status(400).send({
      success: 'false',
      message: 'email, password, name, address, phone are required',
    });
  }
  const user = req.body;

  try {
    //1. save to database
    let savedUser = await User.saveUser(user)
    console.log("savedUser: ", savedUser);

    user.id = savedUser[0].insertId;

    //2. save to firebase
    let savedFirebaseUser = await firebaseAdmin.auth().createUser({
      uid: user.id + "",
      email: user.email,
      password: user.password
    });
    
    delete user.password;//delete password

    //3. return response
    res.status(201).json(user);

  } catch (err) {
    console.log("ERROR: ", err)

    //delete local user if added
    if (user.id !== undefined)
      User.deleteUser(user.id);

    res.status(400).json({
      message: "unable to create record"
    });
  };

};

exports.edit = (req, res, next) => {

  console.log("edit user");
  if (req.user == null || 
    !req.body.address ||
    !req.body.name ||
    !req.body.phone) {
    return res.status(400).send({
      success: 'false',
      message: 'name, address, phone are required',
    });
  }
  //update user info
  req.user.name = req.body.name;
  req.user.address = req.body.address;
  req.user.phone = req.body.phone;

  User.updateUser(req.user).then(result => {
    
    if(result[0].affectedRows != 1)
      throw new Error('Update User Fail!')

    res.status(200).json(req.user);
  }).catch(err => {
    console.log(err);
    res.status(400).json({
      message: "Bad request"
    });
  });
};