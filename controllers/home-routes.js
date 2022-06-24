const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
  console.log("Home Route")
  Post.findAll({
    attributes: [
      "id",
      "post_content",
      "title",
      "created_at"
    ],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      if (req.session.loggedIn) {
        res.render("homepage", { loggedIn: req.session.loggedIn, user_id: req.session.user_id, user_name: req.session.user_name, user_email: req.session.user_email });
       
        console.log(posts, "Blog")
      }
      else {
        res.render("homepage", { posts, loggedIn: req.session.loggedIn });
      }
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
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found' });
        return;
      }
      const post = dbPostData.get({ plain: true });
      res.render('single-post', { post, loggedIn: true });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.render("homepage", { loggedIn: req.session.loggedIn, user_id: req.session.user_id, user_name: req.session.user_name, user_email: req.session.user_email });
    return;
  }
  res.render("login");
});


module.exports = router;
