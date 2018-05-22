const User = require("./../model/database");
const userController = {};
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;


userController.checkExisting = (req,res,next) => {
    if(req.body.username && req.body.password){
        User.count({username : req.body.username}, (err,results) => {
            if(err){ res.send(err)}
            if(results !== 0) {res.send("the username is taken.")};
            next();
        })
    }else{
       res.send("The username or password cannot be empty.")
    }
}

userController.createUser = (req, res, next) => {
  let {name,password} = req.body;
  let salt;
  let hash;
  if (
    typeof req.body.username === "string" &&
    typeof req.body.password === "string"
  ) {
    let promise = new Promise(((resolve,reject) => {
      console.log("in the new promise");
      bcrypt.genSalt(SALT_WORK_FACTOR, (err,saltt) => {
        console.log("bcrypt genSalt");
        if(err) { console.log("salt generation err", err); reject(err);};
        salt = saltt;
        bcrypt.hash(password, saltt, (err,hash) => {
          if(err) { console.log("hash generation err", err); reject};
          password = hash;
          console.log("this is the hash!!!!", hash);
          resolve();
        });
      });
    })).then(() => {
      console.log("Armannnnnn");
      User.create(
      {
        username: req.body.username,
        password: password,
        salt: salt,
        level: 0,
        totalTime: 0,
        createdAt: Date.now()
      },
      (err, updated) => {
        if(err){ console.log(err);
          res.send(err);
        }else{
          console.log("created user!!!!")
          res.send(updated);
        }
      }
    )})
    // .catch(err){
    //   console.log("ERRRRRR", err)
    // }
      }
};

module.exports = userController;
