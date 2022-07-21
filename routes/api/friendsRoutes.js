const router = require('express').Router();
const {
  getFriends,
  getSingleFriend,
  createFriend,
} = require('../../controllers/friendController');

// /api/friends
router.route('/').get(getFriends).post(createFriend);

// /api/friends/:friendId
router.route('/:friendId').get(getSingleFriend);

module.exports = router;
