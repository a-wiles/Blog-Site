const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
  Post.findAll({
    attributes: [
      "id",
      "post_content",
      "title",
      "created_at"
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_body", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
        const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render("homepage", { posts });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/post/:id", withAuth, (req, res) => {

  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'post_content',
      'title',
      'created_at',
    ],
    include: [
      {
        model: Comment,
        attributes: [
          'id',
          'comment_body',
          'post_id',
          'user_id',
          'created_at'
        ],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Category,
        attributes: ['id', 'category_name']
      }
    ]
  })
  .then(dbPostData => {
    if(!dbPostData) {
      res.status(404).json({ message: 'No post found' });
      return;
    }
    const post = dbPostData.get({plain: true});
    res.render('single-post', { post, loggedIn: true });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});


router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("/");
});


module.exports = router;
