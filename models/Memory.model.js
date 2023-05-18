const { Schema, model } = require("mongoose");


const memorySchema = new Schema(
  {
      title: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      description: String,
      usefulFor: String,
      link: String,
      video: String,
      imageUrl: String,
    },
  {
    // adding extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Memory = model("Memory", memorySchema);

module.exports = Memory;