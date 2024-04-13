const mongoose = require("mongoose");
const Bin = require("../models/bins");
const Item = require("../models/items");

const addItemToBin = async (itemsData, binName) => {
  // Start a new session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the bin by name
    const bin = await Bin.findOne({ name: binName }).session(session);
    if (!bin) {
      throw new Error("Bin not found");
    }

    const barcodes = itemsData.map((item) => item.barcode);

    // Find all items in the array of barcodes
    const items = await Item.find({ barcode: { $in: barcodes } }).session(
      session
    );
    if (items.length !== barcodes.length) {
      throw new Error("One or more items not found");
    }

    // Update each item's location and quantity
    for (const item of items) {
      const itemData = itemsData.find((data) => data.barcode === item.barcode);
      if (!itemData) {
        throw new Error("Item data not found");
      }

      const existingLocationIndex = item.locations.findIndex(
        (loc) => loc.location === binName
      );
      if (existingLocationIndex !== -1) {
        item.locations[existingLocationIndex].quantity += itemData.quantity;
      } else {
        item.locations.push({ location: binName, quantity: itemData.quantity });
      }
      await item.save();
    }

    // Update bin's items array
    for (const itemData of itemsData) {
      const currentItem = items.find(
        (item) => item.barcode === itemData.barcode
      );
      console.log("CURR ITEM PHOTO", currentItem.photo);
      console.log("CURR ITEM PRICE", currentItem.price);

      const existingBinItemIndex = bin.items.findIndex(
        (item) => item.barcode === itemData.barcode
      );
      if (existingBinItemIndex !== -1) {
        bin.items[existingBinItemIndex].quantity += itemData.quantity;
      } else {
        bin.items.push({
          barcode: itemData.barcode,
          quantity: itemData.quantity,
          name: currentItem.name,
          photo: currentItem.photo,
        });
      }
    }

    // Save the updated bin
    const savedBin = await bin.save();

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return savedBin;
  } catch (error) {
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const removeItemFromBin = async (itemsData, binName) => {
  // Start a new session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the bin by name
    const bin = await Bin.findOne({ name: binName }).session(session);
    if (!bin) {
      throw new Error("Bin not found");
    }

    const barcodes = itemsData.map((item) => item.barcode);

    // Find all items in the array of barcodes
    const items = await Item.find({ barcode: { $in: barcodes } }).session(
      session
    );
    if (items.length !== barcodes.length) {
      throw new Error("One or more items not found");
    }

    // Update each item's location and quantity
    for (const item of items) {
      const itemData = itemsData.find((data) => data.barcode === item.barcode);
      if (!itemData) {
        throw new Error("Item data not found");
      }

      const existingLocationIndex = item.locations.findIndex(
        (loc) => loc.location === binName
      );
      if (existingLocationIndex !== -1) {
        if (
          item.locations[existingLocationIndex].quantity > itemData.quantity
        ) {
          item.locations[existingLocationIndex].quantity -= itemData.quantity;
        } else {
          item.locations.splice(existingLocationIndex, 1);
        }
      }
      await item.save();
    }

    // Update bin's items array
    for (const itemData of itemsData) {
      const existingBinItemIndex = bin.items.findIndex(
        (item) => item.barcode === itemData.barcode
      );
      if (existingBinItemIndex !== -1) {
        if (bin.items[existingBinItemIndex].quantity > itemData.quantity) {
          bin.items[existingBinItemIndex].quantity -= itemData.quantity;
        } else {
          bin.items.splice(existingBinItemIndex, 1);
        }
      }
    }

    // Save the updated bin
    const savedBin = await bin.save();

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return savedBin;
  } catch (error) {
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const moveItemBins = async (itemsData, originalLocation, targetLocation) => {
  // Start a new session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find all items in the array of itemsData
    const barcodes = itemsData.map((item) => item.barcode);
    const items = await Item.find({ barcode: { $in: barcodes } }).session(
      session
    );
    if (items.length !== barcodes.length) {
      throw new Error("One or more items not found");
    }

    // Update each item's location and quantity
    for (const item of items) {
      const itemData = itemsData.find((data) => data.barcode === item.barcode);
      if (!itemData) {
        throw new Error("Item data not found");
      }

      // Find the index of the original location in the item's locations
      const originalIndex = item.locations.findIndex(
        (loc) => loc.location === originalLocation
      );
      if (originalIndex !== -1) {
        if (item.locations[originalIndex].quantity > itemData.quantity) {
          item.locations[originalIndex].quantity -= itemData.quantity;
        } else {
          item.locations.splice(originalIndex, 1); // Remove from original location if quantity is zero
        }
      }

      // Find the index of the target location in the item's locations
      const targetIndex = item.locations.findIndex(
        (loc) => loc.location === targetLocation
      );
      if (targetIndex === -1) {
        // If target location doesn't exist in item's locations, add it
        item.locations.push({
          location: targetLocation,
          quantity: itemData.quantity,
        });
      } else {
        // If target location already exists in item's locations, update quantity
        item.locations[targetIndex].quantity += itemData.quantity;
      }

      // Save the updated item
      await item.save();
    }

    // Update bin's items array
    const bin = await Bin.findOne({ name: targetLocation }).session(session);
    if (!bin) {
      throw new Error("Target bin not found");
    }

    for (const itemData of itemsData) {
      const currentItem = items.find(
        (item) => item.barcode === itemData.barcode
      );
      const existingBinItemIndex = bin.items.findIndex(
        (item) => item.barcode === itemData.barcode
      );
      if (existingBinItemIndex !== -1) {
        bin.items[existingBinItemIndex].quantity += itemData.quantity;
      } else {
        bin.items.push({
          barcode: itemData.barcode,
          quantity: itemData.quantity,
          photo: currentItem.photo,
          name: currentItem.name,
        });
      }
    }

    await bin.save();

    // Remove items from the original location
    const originalBin = await Bin.findOne({ name: originalLocation }).session(
      session
    );
    if (!originalBin) {
      throw new Error("Original bin not found");
    }

    for (const itemData of itemsData) {
      const existingOriginalBinItemIndex = originalBin.items.findIndex(
        (item) => item.barcode === itemData.barcode
      );
      if (existingOriginalBinItemIndex !== -1) {
        originalBin.items[existingOriginalBinItemIndex].quantity -=
          itemData.quantity;
        // Remove item from original bin if quantity becomes 0
        if (originalBin.items[existingOriginalBinItemIndex].quantity <= 0) {
          originalBin.items.splice(existingOriginalBinItemIndex, 1);
        }
      }
    }

    await originalBin.save();

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = { addItemToBin, removeItemFromBin, moveItemBins };
