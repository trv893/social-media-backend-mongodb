const { User, Thoughts } = require('../models');

module.exports = {
  // GET all users with /api/users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // GET a single user /api/users/:id
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.id })
    .populate([
      { path: 'thoughts', select: "-__v" },
      { path: 'friends', select: "-__v" }
    ])
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) =>{
        console.log(err);
        res.status(500).json(err)
      } );
  },
  // create a new user POST /api/users
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
   // Update a current User by ID, PUT /api/users/:id
 updateUser(req, res) {
  User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
  .then(dbUsersData => {
      if(!dbUsersData) {
          res.status(404).json({message: 'No User with this particular ID!'});
          return;
      }
      res.json(dbUserData);
  })
  .catch(err => res.json(err))
  },
  // Delete a user and associated apps, DELETE /api/users/:id
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thoughts.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and associated content deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
};

