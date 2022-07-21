const router = require('express').Router();
const appRoutes = require('./thoughtsRoutes');
const userRoutes = require('./userRoutes');

router.use('/apps', appRoutes);
router.use('/users', userRoutes);

module.exports = router;
