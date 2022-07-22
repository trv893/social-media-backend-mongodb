const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reactions");
const moment = require('moment');

// Schema to create Post model
const thoughtsSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },
    username: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      minLength: 15,
      maxLength: 500,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Create a virtual property `getFriendss` that gets the amount of friendss associated with an thoughts
thoughtsSchema
  .virtual("reactionCount")
  .get(function () {
    return this.reactions.length;
  });

// Initialize our thoughts model
const Thoughts = model("Thoughts", thoughtsSchema);

module.exports = Thoughts;
