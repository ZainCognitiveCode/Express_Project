const User = require('../models/user');
const { validationResult } = require('express-validator');

// Get User Data (Single or All Users)
const getUserData = async (req, res) => {
    try {
        const { id } = req.params;
        if (id && isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid user ID' });

        const users = id 
            ? await User.findByPk(id, { attributes: ['username', 'email'] })
            : await User.findAll({ attributes: ['username', 'email'] });

        if (id && !users) return res.status(404).json({ success: false, message: `User with ID ${id} not found` });

        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, message: 'Error fetching user data', error: error.message });
    }
};

// Create User
const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { firstName, lastName, username, email, password } = req.body;
        const newUser = await User.create({ firstName, lastName, username, email, password });
        res.status(201).json({ success: true, message: 'User added successfully', newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: 'Error creating user', error: error.message });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, username, email } = req.body;
        const user = await User.findByPk(id);

        if (!user) return res.status(404).json({ success: false, message: `User with ID ${id} not found` });

        await user.update({
            username: username || user.username,
            email: email || user.email,
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName
        });

        res.status(200).json({ success: true, message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) return res.status(404).json({ success: false, message: `User with ID ${id} not found` });

        await user.destroy();
        res.status(200).json({ success: true, message: `User with ID ${id} deleted successfully` });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
    }
};

module.exports = { getUserData, createUser, updateUser, deleteUser };
