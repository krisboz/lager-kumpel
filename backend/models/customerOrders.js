const mongoose = require("mongoose");
const { getNextSequenceValue } = require("./orderNoSequence"); // Adjust the path as necessary

const AddressSchema = new mongoose.Schema({
  street: String,
  houseNumber: Number,
  zipCode: String,
  city: String,
  country: String,
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customerName: { type: String, required: true },
  items: Array,
  address: {
    type: AddressSchema,
    required: false,
  },
  inPicklist: { type: Boolean, default: false },
  processed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

orderSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Pre-save middleware to generate the order number
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      // Get the next sequence value for orderNumber and set it
      this.orderNumber = await getNextSequenceValue("orderNumber");
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
