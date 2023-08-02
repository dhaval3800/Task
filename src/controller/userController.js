const { Op } = require('sequelize');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const signUpUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username.trim() },
                    { email: email.trim().toLowerCase() },
                ],
            },
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Email or username already exists' });
        }
        const user = await User.create({ username, email, password });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const logInUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res.status(401).json({ error: 'Check authentication credentials' });
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Check authentication credentials' });
        }

        const token = jwt.sign({ id: user.id },process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        res.json({ user, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const readUserProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(req.user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const readAllProfile = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    signUpUser,
    logInUser,
    readUserProfile,
    readAllProfile
}