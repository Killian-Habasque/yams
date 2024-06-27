const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const scoreController = require('../controllers/scoreController');
const ruleController = require('../controllers/ruleController');
const middleware = require('../middlewares');

router.get('/', (req, res) => {
  res.send('Bienvenue sur votre API !');
});

router.get('/user', middleware.verifyToken, userController.getUser);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/logout', userController.logout);

router.get('/scores', scoreController.getScores);
router.put('/score', middleware.verifyToken, scoreController.setScore);

router.get('/rules', ruleController.getRules);

module.exports = router;