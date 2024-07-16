const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgot', authController.forgotPassword);
router.patch('/reset/:resetToken', authController.resetPassword);

router.patch('/updateMe', userController.updateMyData);
router.delete('/deleteMe', userController.deleteMe);

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
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(authController.protect, userController.deleteUser);

module.exports = router;
