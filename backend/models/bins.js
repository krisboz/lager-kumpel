const mongoose = require("mongoose");

const innerItemSchema = new mongoose.Schema({
  barcode: { type: String, required: true },
  quantity: { type: Number, required: true },
  name: { type: String, required: true },
  photo: { type: String, required: true },
});

const binSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  items: [innerItemSchema],
});

binSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Bin", binSchema);
