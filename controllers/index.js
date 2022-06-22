const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeroutes.js');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
