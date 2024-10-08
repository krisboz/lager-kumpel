const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  location: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const itemSchema = new mongoose.Schema({
  barcode: { type: String, required: [true, "barcode required"] },
  cost: Number,
  name: String,
  description: String,
  price: Number,
  date: { type: Date, default: Date.now },
  photo: String,
  locations: [locationSchema],
  history: [
    {
      date: { type: Date, default: Date.now },
      user: { type: String, default: "User-1" },
      quantity: Number,
      action: String,
      originBin: String,
      targetBin: String,
      description: String,
    },
  ],
  /**
   * date
   * user
   * quantity
   * action
   * from
   * to
   * 
   * 15:55 | MOVE | Qty:2 | 1-a-1 | 1-a-3 |Internal movement | Kiki
   * 15:57 | ADD | Qty:1, | 1-a-1 | Internal movement | Kiki
   * 16:00 | SCAN-IN | Qty:1 | 1-a-1 | Scan in for order #0000040 | Kiki

   */
  quantity: Number,
});

itemSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Item", itemSchema);

/**
 * barcode
photo-link
cost
price
location(s)
quantity
 */

//From A Different Video

/**
 * I use a JavaScript object to create the Mongoose schema dynamically. I then use the Mongoose
 * schema to create a model. I use the mongoose model
 * to insert, query, and delete documents
 * from the mongoDB database
 * 
 * 
 * // Define a method to add custom properties dynamically
ItemSchema.methods.addCustomProperty = function (propertyName, propertyValue) {
  this.customProperties[propertyName] = propertyValue;
};

// Example of adding a custom property
const Artikkel = mongoose.model("Artikkel", ItemSchema);

const article = new Artikkel();
article.addCustomProperty("size", "XL");
article.addCustomProperty("color", "red");
console.log(article);

 */
