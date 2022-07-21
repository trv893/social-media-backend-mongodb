const { Schema, model } = require("mongoose");
import Moment from 'moment';

// Schema to create Post model
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280,
      },
      _user: {
        type: ObjectId,
        ref: "user",
      },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Create a virtual property `getFriendss` that gets the amount of friendss associated with an thoughts
reactionSchema
  .virtual("formatDate")
  // Getter
  .get(function () {
    return Moment(this.createdAt).format("MMM Do YY")
  })
//   .set(function (v) {
//     const formattedDate = v
//     this.set({ formattedDate });
//   });

// Initialize our thoughts model
const Reactions = model("reactions", reactionSchema);

module.exports = Reactions;
