const { Schema, model } = require("mongoose");


const memorySchema = new Schema(
  {
      title: String,
      category: String,
      content: [{ type: Schema.Types.ObjectId, ref: "Content"}] 
    },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Memory = model("Memory", memorySchema);

module.exports = Memory;