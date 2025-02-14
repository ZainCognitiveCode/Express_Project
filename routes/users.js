const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { validateUser } = require('../Validation/UserValidator');

 router.param('id',(req,res,next,val)=>{
    console.log(`The user id is: ${val}`);
    next();
})

// API Routes
router
  .get('/:id?',  userController.getUserData)
  .post('/', validateUser, userController.createUser)
  .put('/:id', userController.updateUser)
  .delete('/:id?', userController.deleteUser);

module.exports = router;
