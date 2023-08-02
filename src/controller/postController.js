const Post = require('../models/post');
const User = require('../models/user');
const path = require('path');

const createPost = async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title, description and user ID are required' });
    }

    let image = null;
    if (req.file) {
        image = req.file.path;  
    }

    try {
        const post = await Post.create({ title, description, image, userId: req.user.id });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getPostImage =  async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post || !post.image) {
            return res.status(404).send("post or image not found"); 
        }
        res.setHeader('Content-Type', 'image/png');
        const imagePath = path.join(__dirname,"../../", post.image)
        res.sendFile(imagePath); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const readMyPost = async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { userId: req.user.id },
            include: {
                model: User,
                attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
            }
        });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const readAllPost = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
            }
        });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createPost,
    readMyPost,
    readAllPost,
    getPostImage
}