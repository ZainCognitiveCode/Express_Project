const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { validateUser } = require('../Validation/UserValidator');

// API's
router.get('/:id?',userController.getUserData);
router.post('/',validateUser,userController.createUser);
router.put('/:id',userController.updateUser);
router.delete('/:id',userController.deleteUser);


module.exports = router;


