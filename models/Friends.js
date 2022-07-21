const { Schema, Types } = require('mongoose');

const friendsSchema = new Schema(
  {
    friendsId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    friendsBody: {
      type: String,
      required: true,
      maxlength: 25,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

module.exports = friendsSchema;
