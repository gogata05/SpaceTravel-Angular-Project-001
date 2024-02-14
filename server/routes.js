//?
//is tripController the best name?



const router = require('express').Router();

const userController = require('./controllers/userController');
const tripController = require('./controllers/tripController');

router.use('/api/users', userController);
router.use('/api/trips', tripController);

module.exports = router;