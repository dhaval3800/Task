const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPost, readMyPost, readAllPost, getPostImage } = require('../controller/postController');
const multer = require('multer');

const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            cb(new Error('Not an image! Please upload an image (.jpg, .jpeg, or .png).'), false);
        } else {
            cb(null, true);
        }
    },
});  

router.post('/', auth, upload.single('image'), createPost);

router.get('/myPosts', auth, readMyPost);

router.get('/allPosts', readAllPost);

router.get('/:id/image', getPostImage);


router.use((err, req, res, next) => {
    if (err.message === 'Not an image! Please upload an image (.jpg, .jpeg, or .png).') {
        return res.status(400).json({ error: err.message });
    }
    next(err);
});

module.exports = router;
