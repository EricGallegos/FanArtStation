const User = require('../User.js');

exports.register = async (req, res, next) =>{
  const {username, password} = req.body;
  if(password.length < 6){
    return res.status(400).json({message: "password less than 6 chars"});
  }
  try{
    await User.create({
      username,
      password,
    }).then(user => res.status({message: "User was created successfully"}))
  }
  catch(err){
      res.status(401).json({
        message: "User creation failed",
        error: err.message,
      });
  }
}
