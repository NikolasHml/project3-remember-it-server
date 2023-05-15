const { Schema, model } = require("mongoose");


const ideaSchema = new Schema(
  {
    ideaTitle: {
      type: String,
    },
    about: {
      type: String,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Idea = model("Idea", ideaSchema);

module.exports = Idea;