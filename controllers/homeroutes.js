const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const dbUserData = await User.findAll({
      include: [
        {
          model: Post,
        },
      ],
    });

    const userData = dbUserData.map((post) =>
      post.get({ plain: true })
    );

    console.log(userData);
    res.render('homepage', {
      userData,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const dbUserData = await User.findByPk(req.session.user_id, {
      include: [
        {
          model: Post,
        },
      ],
    });
    
    const userData = dbUserData.get({ plain: true });
    res.render('dashboard', { userData, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
