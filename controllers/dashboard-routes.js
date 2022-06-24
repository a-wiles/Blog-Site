const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id', 'post_content', 'title', 'created_at'
        ],
        include: [{
            model: Comment,
            attributes: ['id', 'comment_body', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        }]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({plain: true}));

        console.log(posts)
        res.render('dashboard', {loggedIn: true, posts});
    })
    .catch(err => {
        res.status(500).json(err);
        });
});

module.exports = router;