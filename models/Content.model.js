const { Schema, model } = require("mongoose");


const contentSchema = new Schema(
  {
      title: String,
      description: String,
      memory: [{ type: Schema.Types.ObjectId, ref: "Memory"}] 
    },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Content = model("Content", contentSchema);

module.exports = Content;