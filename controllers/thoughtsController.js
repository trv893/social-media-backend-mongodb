const { Thought, Friends, Thoughts } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single user
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.userId })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new user
  createThought(req, res) {
    Thought.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {new: true}
    )
  },
  // Delete a user and associated apps
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Application.deleteMany({ _id: { $in: user.applications } })
      )
      .then(() => res.json({ message: 'Thought and associated apps deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
   // POST /api/thoughts/:id/reactions
   addReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true, runValidators: true }
    )
    .then(dbThoughtId => {
        if (!dbThoughtId) {
            res.status(404).json({ message: 'No thought found with this id' });
            return;
        }
        res.json(dbThoughtId);
    })
    .catch(err => res.status(500).json(err));
},

// DELETE /api/thoughts/:id/reactions
deleteReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: body.reactionId } } },
        { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id' });
            return;
        }
        res.json({message: 'Successfully deleted the reaction'});
    })
    .catch(err => res.status(500).json(err));
},
};
