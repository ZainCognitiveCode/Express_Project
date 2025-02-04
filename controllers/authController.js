const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv'); // Correct dotenv import
const crypto = require('crypto');
const { Sequelize } = require('sequelize');

dotenv.config();

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // or try 587
    secure: true, // true for port 465, false for port 587
    auth: {
        user: "xain.graphics69@gmail.com",
        pass: "ouar ooue hkpu icin" // Use App Password if 2FA is enabled
    },
    tls: {
        rejectUnauthorized: false
    }
});

  

// SignUp
signUp = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;

        const userExist = await User.findOne({ where: { email } });
        if (userExist) return res.status(400).send("User already Exists");

        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await User.create({ firstName, lastName, username, email, password: hashedPassword });
        console.log("JWT_SECRET:", process.env.JWT_SECRET);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).send({ message: 'User registered successfully!', token });

    } catch (error) {
        console.error(error);
        res.status(500).send("There was a problem registering the user.");
    }
}

// SignIn
logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(' The email is...', email);

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).send("User not found.");

        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) return res.status(400).send("Invalid Password");

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).send({ message: "Login Successfully...", token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error during login.");
    }
}

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).send("User not found");

        const token = crypto.randomBytes(20).toString('hex');
        const expiry = Date.now() + 3600000; // 1 hour

        await user.update({ resetPasswordToken: token, resetPasswordExpires: expiry });

        const resetLink = `http://localhost:3000/reset/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender email
            to: email,
           
            subject: 'Password Reset',
            html: `<p>Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send('Password reset email sent!');

    } catch (error) {
        console.error(error);
        res.status(500).send("Error during password reset.");
    }
};

// Reset Password
resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({ where: { resetPasswordToken: token, resetPasswordExpires: { [Sequelize.Op.gt]: Date.now() } } });
        if (!user) return res.status(400).send("Invalid or expired token.");

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await user.update({ password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null });

        res.status(200).send("Password reset successfully...");
    } catch (error) {
        res.status(500).send("Error resetting password.");
    }
}

module.exports = { signUp, logIn, forgotPassword, resetPassword };
