const router = require('express').Router();
const {Post, User, Comment} = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth')

// CREATE new user
router.post('/', async (req, res) => {
    console.log(req.body)
    try {
      const dbUserData = await Post.create({
        title: req.body.title,
        post_content: req.body.post_content,
        user_id: req.session.user_id,
      });

        res.status(200).json(dbUserData);
    
    } catch (err) {
      console.log(err,"POSTerror");
      res.status(500).json(err);
    }
  });

module.exports = router;