const { connect, connection } = require('mongoose');

connect('mongodb+srv://trv893:pr0gress@cluster0.ba0cyrs.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then((result) => console.log('connected to db'))
.catch((err) => console.log(err));

module.exports = connection;
