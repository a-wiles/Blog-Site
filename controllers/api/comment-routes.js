const router = require('express').Router();
const {Post, User, Comment} = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth')

router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'post_content', 'title', 'created_at'],
        order: [['created_at']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
        });
});

router.post('/', withAuth, (req, res)=> {
    Post.update(
        {
            title: req.body.title
        },
        {where: {
            id: req.params.id
        }}
    )
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({message: 'No Post Found'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err);
    });
});

module.exports = router;