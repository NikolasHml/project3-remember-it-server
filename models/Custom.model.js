const { Schema, model } = require("mongoose");


const customSchema = new Schema(
  {
    customOne: {
      type: String,
    },
    customTwo: {
      type: String,
    },
    customThree: {
      type: String,
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Custom = model("Custom", customSchema);

module.exports = Custom;