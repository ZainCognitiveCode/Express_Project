const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Sequelize } = require('sequelize');



// SignUp
signUp = async(req,res)=>{
    try {
        const {firstName,lastName,username, email, password} = req.body;

        const userExist = await User.findOne({where : {email}});
        if(userExist) return res.status(400).send("User already Exists");

        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await User.create({firstName,lastName,username,email, password: hashedPassword});
        console.log("JWT_SECRET:", process.env.JWT_SECRET);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).send({ message: 'User registered successfully!',token });

    } catch (error) {
        console.error(error);
        res.status(500).send("There was a problem registering the user.");
    }
}

// SignIn

logIn = async(req,res)=>{
    try {
        const {email,password} = req.body;

        console.log(' The email is...', email);


        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).send("User not found.");

        const validPassword = bcrypt.compareSync(password,user.password);

        if(!validPassword) return res.status(400).send("Invalid Password");

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.status(200).send({message: "Login Successfully...",token});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error during login.");
    }
}

// Forgot Password

forgotPassword = async(req,res)=>{
    try {

        const {email} = req.body;

        const user = await User.findOne({where: {email}});
        if(!user) return res.status(400).send("User not found");

        const token = crypto.randomBytes(20).toString('hex');
        const expiry = Date.now() + 3600000; // 1 hour

        await user.update({resetPassowrdToken: token, resetPasswordExpires: expiry});


        const trasnporter = nodemailer.createTransport({
            service : 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        const mailOptions = {
            to : email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: http://localhost:3000/reset/${token}`,
        }

        await trasnporter.sendMail(mailOptions);

        res.status(200).send('Password reset email sent!');

    } catch (error) {
        console.error(error);
        res.status(500).send("Error during password reset.");
    }
}


// Reset Password

resetPassword = async(req,res)=>{
    try {
        const {token, newPassword} = req.body;

        const user = await User.findOne({where: {resetPassowrdToken: token, resetPasswordExpires: {[Sequelize.Op.gt]: Date.now()}}});
        if (!user) return res.status(400).send("Invalid or expired token.");

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await user.update({password: hashedPassword, resetPassowrdToken: null, resetPasswordExpires:null});

        res.status(200).send("Password reset Successfully...");
    } catch (error) {
        res.status(500).send("Error resetting password.");
    }
}

module.exports = {signUp,logIn,forgotPassword,resetPassword};