const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {validateUser} = require('../Validation/UserValidatior');
const { validationResult } = require('express-validator');

// Get Request

router.get('/', async function (req,res){
  const {id} = req.query;

  try {
    let users;

    if(id) {
      users = await User.findByPk(id);
      if(!users){
        return res.status(200).json({message: `User with ${id} not found`});
      }
    }else{
      users = await User.findAll();
    }

    res.status(200).json(users);
    // when we are taking something in response then it is used as above line and data is sent into json form
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error fetching users', error: error.message});
  }
})


// Post Request for creating a User

router.post('/',validateUser,async function (req,res){
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return req.status(400).json({errors: errors.array()});
  }

  const {username,email, password} = req.body;
  const newUser = await User.create({username,email,password});

  res.send('User added Successfully...');
  // when we simple want to print the message.

})

// PUT Request for Updating


router.put('/:id', async(req,res)=>{
  const {id} = req.params;
  const{ username, email} = req.body;

  try {
    const user = await User.findByPk(id);

    if(!user){
      return res.status(404).json({message: `User with ID ${id} not found`});
    }

    await user.update({
      username: username || user.username, email: email || user.email
    });

    res.status(200).json({message: `User Updated Successfully`,user});


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }


})



// Delete Request
// http://localhost:3000/users/1
router.delete('/:id', async (req,res)=>{
  console.log(' I am going to delete a User....')
  const {id} = req.params;
  console.log('The id is....',id);

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    await user.destroy();

    res.status(200).json({ message: `User with ID ${id} deleted successfully` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
})





module.exports = router;


