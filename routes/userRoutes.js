const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot', authController.forgotPassword);
router.patch('/reset/:resetToken', authController.resetPassword);

// Protect all routes after this middleware, very effective and powerful
router.use(authController.protect);

router.patch('/updateMe', authController.protect, userController.updateMyData);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
router.get('/getme', userController.getMe, userController.getUser);
router.patch('/updatepassword', authController.updatePassword);

// Only Admins have access to the routes after this middleware
router.use(authController.authorize('ADMIN'));

router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(authController.protect, userController.deleteUser);

module.exports = router;
