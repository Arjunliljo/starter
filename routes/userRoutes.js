const express = require('express');
const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/:userId').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
