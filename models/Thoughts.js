const { Schema, model } = require('mongoose');
const Friends = require('./Friends');
const Reactions = require('./Reactions');

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
    reactions: [
      {
        ref: 'reactions',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Create a virtual property `getFriendss` that gets the amount of friendss associated with an thoughts
thoughtsSchema
  .virtual('reactionCount')
  // Getter
  .get(function () {
    return this.reactions.length;
  });

// Initialize our thoughts model
const Thoughts = model('thoughts', thoughtsSchema);

module.exports = Thoughts;
