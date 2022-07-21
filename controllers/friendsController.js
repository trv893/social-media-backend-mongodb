const { User, Friends, Thoughts } = require('../models');

module.exports = {
  getFriends(req, res) {
    Friends.find()
      .then((friends) => res.json(friends))
      .catch((err) => res.status(500).json(err));
  },
  getSingleFriends(req, res) {
    Friends.findOne({ _id: req.params.friendId })
      .then((friend) =>
        !friend
          ? res.status(404).json({ message: 'No friend with that ID' })
          : res.json(friend)
      )
      .catch((err) => res.status(500).json(err));
  },
  // going to be used in creating data from a post, using the request's body
  createFriends(req, res) {
    Friends.create(req.body)
      .then((friend) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { friends: friend._id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'Friends created, but found no user with that ID',
            })
          : res.json('Created the friend 🎉')
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // update the data using friendId from the url (req.params)
  updateFriends(req, res) {
    Friends.findOneAndUpdate(
      { _id: req.params.friendId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((friend) =>
        !friend
          ? res.status(404).json({ message: 'No friend with this id!' })
          : res.json(friend)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // delete the friend document from the database using friendId from the req.params
  // and will remove any related data from the User document as well
  deleteFriends(req, res) {
    Friends.findOneAndRemove({ _id: req.params.friendId })
      .then((friend) =>
        !friend
          ? res.status(404).json({ message: 'No friend with this id!' })
          // ON Delete CASCADE, in other words remove any null friend ids
          : User.findOneAndUpdate(
              { friends: req.params.friendId },
              // this pull removes an id from a list of friend ids
              { $pull: { friends: req.params.friendId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'Friends created but no user with this id!',
            })
          : res.json({ message: 'Friends successfully deleted!' })
      )
      .catch((err) => res.status(500).json(err));
  },
  // using the friendId from the request, 
  // adding the tag data object to the friend as a sub document
  addTag(req, res) {
    Friends.findOneAndUpdate(
      { _id: req.params.friendId },
      { $addToSet: { tags: req.body } },
      { runValidators: true, new: true }
    )
      .then((friend) =>
        !friend
          ? res.status(404).json({ message: 'No friend with this id!' })
          : res.json(friend)
      )
      .catch((err) => res.status(500).json(err));
  },
  // using friendId to find the Friends to update
  // and then using the tagId to find the subdocument to remove
  removeTag(req, res) {
    Friends.findOneAndUpdate(
      { _id: req.params.friendId },
      // this pull is doing a search within an array to remove a sub document
      // tags is the array
      // tagId is the field we are using to track the tagId
      { $pull: { tags: { tagId: req.params.tagId } } },
      { runValidators: true, new: true }
    )
      .then((friend) =>
        !friend
          ? res.status(404).json({ message: 'No friend with this id!' })
          : res.json(friend)
      )
      .catch((err) => res.status(500).json(err));
  },
};
