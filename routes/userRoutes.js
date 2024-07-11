const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgot', authController.forgotPassword);
router.patch('/reset/:resetToken', authController.resetPassword);

router.patch('/updateMe', authController.protect, userController.updateMyData);

router.patch(
  '/updatepassword',
  authController.protect,
  authController.updatePassword,
);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:userId')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.authorize('ADMIN', 'LEADTOURGUIDE'),
    userController.deleteUser,
  );

module.exports = router;
