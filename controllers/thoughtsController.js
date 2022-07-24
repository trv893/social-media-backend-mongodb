const { Thoughts, User, Reactions } = require("../models");

module.exports = {
  // Get all thoughts /api/thoughts
  getThoughts(req, res) {
    Thoughts.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single thought
  getSingleThought(req, res) {
    Thoughts.findOne({ _id: req.params.thoughtId })
      .populate({ path: 'reactions', select: '-__v' })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new thought
  createThought(req, res) {
    Thoughts.create(req.body)
    .then(thought => {
      User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thought._id } },
          { new: true }
      )
      .then(user => {
          if (!user) {
              res.status(404).json({ message: 'No user found with this id while trying to update thoughts list' });
              return;
          }
          res.json(user);
      })
      .catch(err => {
        console.log(err);

        res.json(err)});
  })
  .catch(err => {
    console.log(err);

    res.status(400).json(err)
  });
},
  // Update a thought
  updateThought(req, res) {
    console.log(req.params);

    Thoughts.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, { new: true })
    .then(thought => {
      if (!thought) {
        res.status(404).json({ message: 'No thought found with this id' });
                return;
      }
      res.json(thought)
    })
    .catch(err => res.status(400).json(err));
  },
  // Delete a thought and associated apps
  deleteThought(req, res) {
    Thoughts.findOneAndDelete({ _id: req.params.thoughtId })
      .then(thought =>{
        console.log(thought);
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : Thoughts.deleteMany({ _id: { $in: thought.thoughts } })
      })
      .then(() => res.json({ message: "Thought and associated data deleted!" }))
      .catch((err) => res.status(500).json(err));
  },
  // POST /api/thoughts/:id/reactions
  addReaction(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true, runValidators: true }
    )
      .then((thoughtId) => {
        if (!thoughtId) {
          res.status(404).json({ message: "No thought found with this id" });
          return;
        }
        res.json(thoughtId);
      })
      .catch((err) =>{
        console.log(err);
        res.status(500).json(err)});
      
  },

  // DELETE /api/thoughts/:id/reactions
  deleteReaction({ params, body }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: body.reactionId } } },
      { new: true, runValidators: true }
    )
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "No thought found with this id" });
          return;
        }
        res.json({ message: "Successfully deleted the reaction" });
      })
      .catch((err) => res.status(500).json(err));
  },
};
