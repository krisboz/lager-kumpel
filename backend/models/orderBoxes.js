const mongoose = require("mongoose");

const boxSchema = new mongoose.Schema({
  number: { type: Number, unique: true, required: true },
  order: Object,
  isFree: { type: Boolean, default: true },
  scannedItems: {
    type: [
      {
        barcode: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

boxSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Box = mongoose.model("Box", boxSchema);

module.exports = Box;
