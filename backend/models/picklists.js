const mongoose = require("mongoose");
const { getNextSequenceValue } = require("./orderNoSequence"); // Adjust the path as necessary

//

const picklistSchema = new mongoose.Schema({
  picklistNumber: { type: String, unique: true },
  items: {
    type: [
      {
        barcode: { type: String, required: true },
        quantity: { type: Number, required: true },
        location: { type: String, required: true },
        photo: { type: String, required: true },
        isPicked: { type: Boolean, default: false },
      },
    ],

    //validate: [arrayNotEmpty, "{PATH} cannot be empty"], // Custom validation function
  },
  orders: Array,
  createdAt: { type: Date, default: Date.now },
});

/**
 * Previous order schema
 * {
    type: [
      {
        orderNumber: { type: String, required: true },
        items: {
          type: [
            {
              barcode: { type: String, required: true },
              quantity: { type: Number, required: true },
              scanned: { type: Number, required: true, default: 0 },
            },
          ],
        },
      },
    ],
  },
 */

// Custom validation function to check if the array is not empty
function arrayNotEmpty(val) {
  return val.length > 0;
}

picklistSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      // Get the next sequence value for orderNumber and set it
      this.picklistNumber = await getNextSequenceValue("picklistNumber");
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

picklistSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Picklist = mongoose.model("Picklist", picklistSchema);

module.exports = Picklist;
