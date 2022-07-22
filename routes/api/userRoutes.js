const router = require("express").Router();

const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../controllers/userController");

// /api/users
router
  .route("/")
  .get(getUsers)
  .post(createUser);

// /api/users/:id
router
  .route("/:id")
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser);
router
  .route('/:id/:friendsId')
  .post(addFriend)
  .delete(removeFriend);

module.exports = router;
