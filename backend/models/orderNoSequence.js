const mongoose = require("mongoose");

// Counter Schema to keep track of sequences
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

// Function to get the next sequence value for a given counter name
const getNextSequenceValue = async (name) => {
  // Find the counter document for 'orderNumber' and increment its seq field by 1
  const sequenceDoc = await Counter.findOneAndUpdate(
    { name }, // Search for the counter with name 'orderNumber'
    { $inc: { seq: 1 } }, // Increment the seq field by 1
    { new: true, upsert: true } // Return the updated document and create it if it doesn't exist
  );

  // Return the updated sequence value as a zero-padded 7-digit string
  return sequenceDoc.seq.toString().padStart(7, "0");
};

module.exports = { getNextSequenceValue, Counter };
