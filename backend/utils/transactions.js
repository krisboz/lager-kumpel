const mongoose = require("mongoose");
const Bin = require("../models/bins");
const Item = require("../models/items");
const Picklist = require("../models/picklists");
const Box = require("../models/orderBoxes");
const helpers = require("./helpers");

const startSession = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  return session;
};

const commitAndEndSession = async (session) => {
  await session.commitTransaction();
  session.endSession();
};

const findBinByName = async (binName, session) => {
  const bin = await Bin.findOne({ name: binName }).session(session);
  if (!bin) {
    throw new Error("Bin not found");
  }
  return bin;
};

const findItemsByBarcodes = async (barcodes, session) => {
  const items = await Item.find({ barcode: { $in: barcodes } }).session(
    session
  );
  if (items.length !== barcodes.length) {
    throw new Error("One or more items not found");
  }
  return items;
};

const updateItemLocations = async (items, itemsData, binName) => {
  for (const item of items) {
    const itemData = itemsData.find((data) => data.barcode === item.barcode);
    if (!itemData) {
      throw new Error("Item data not found");
    }

    const existingLocationIndex = item.locations.findIndex(
      (loc) => loc.location === binName
    );
    if (existingLocationIndex !== -1) {
      item.locations[existingLocationIndex].quantity += +itemData.quantity;
    } else {
      item.locations.push({ location: binName, quantity: itemData.quantity });
    }
    await item.save();
  }
};

const updateBinItems = async (bin, items, itemsData) => {
  for (const itemData of itemsData) {
    const currentItem = items.find((item) => item.barcode === itemData.barcode);
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
};

const addItemToBin = async (itemsData, binName) => {
  const session = await startSession();

  try {
    const bin = await findBinByName(binName, session);
    const barcodes = itemsData.map((item) => item.barcode);
    const items = await findItemsByBarcodes(barcodes, session);

    await updateItemLocations(items, itemsData, binName);
    await updateBinItems(bin, items, itemsData);

    await bin.save();
    await commitAndEndSession(session);
    return bin;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const removeItemFromBin = async (itemsData, binName) => {
  const session = await startSession();

  try {
    const bin = await findBinByName(binName, session);
    const barcodes = itemsData.map((item) => item.barcode);
    const items = await findItemsByBarcodes(barcodes, session);

    await updateItemLocations(items, itemsData, binName);

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

    await bin.save();
    await commitAndEndSession(session);
    return bin;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deletePicklistByNumber = async (picklistNumber) => {
  const session = await startSession();
  try {
    const picklist = await Picklist.findOneAndDelete({
      picklistNumber,
    }).session(session);

    if (!picklist) {
      throw new Error("Picklist not found");
    }

    await commitAndEndSession(session);
    return { message: "Picklist deleted successfully", picklist };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteItemFromPicklist = async (picklistNumber, barcode) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const picklist = await Picklist.findOne({ picklistNumber }).session(
      session
    );

    if (!picklist) {
      throw new Error("Picklist not found");
    }

    const itemIndex = picklist.items.findIndex(
      (item) => item.barcode === barcode
    );

    if (itemIndex === -1) {
      throw new Error("Item not found in picklist");
    }

    picklist.items.splice(itemIndex, 1);

    await picklist.save({ session });
    await session.commitTransaction();
    session.endSession();

    return { message: "Item deleted successfully from picklist", picklist };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const ScanInItem = async (picklistNumber, barcode, quantity) => {
  const session = await startSession();
  try {
    const picklist = await Picklist.findOne({ picklistNumber }).session(
      session
    );

    if (!picklist) {
      throw new Error("Picklist not found");
    }

    const itemIndex = picklist.items.findIndex(
      (item) => item.barcode === barcode
    );

    if (itemIndex === -1) {
      throw new Error("Item not found in picklist");
    }

    const item = picklist.items[itemIndex];
    const itemsData = [{ barcode, quantity }];

    // Call removeItemFromBin to remove the item from the bin
    await removeItemFromBin(itemsData, item.location);

    if (picklist.items.length === 1 && item.barcode === barcode) {
      await deletePicklistByNumber(picklistNumber);
    } else {
      if (item.quantity < quantity) {
        throw new Error("No such item left in picklist");
      }
      //Scanned less than available
      if (item.quantity > quantity) {
        item.quantity -= quantity;
        await picklist.save({ session });
      }
      //Scanned exactly the amount that was in the picklist
      if (item.quantity === quantity) {
        await deleteItemFromPicklist(picklistNumber, barcode);
        await picklist.save({ session });
      }
    }

    //Last item has been scanned

    const boxAfterSave = await assignToBox(
      picklist,
      barcode,
      quantity,
      session
    );

    // Commit the transaction and end the session
    await commitAndEndSession(session);
    //console.log({ boxAfterSave, item });
    if (
      helpers.sumQuantities(boxAfterSave.order.items) ===
      helpers.sumQuantities(boxAfterSave.scannedItems)
    ) {
      console.log({
        orderQuantity: helpers.sumQuantities(boxAfterSave.order.items),
        scannedQuantity: helpers.sumQuantities(boxAfterSave.scannedItems),
      });
      console.log("THE BOX HAS BEEN SCANNED");
    }

    return { item, box: boxAfterSave };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

async function assignToBox(picklist, barcode, quantity, session) {
  try {
    const orders = picklist.orders;
    const boxes = await Box.find({}).session(session);
    const targetBox = determineTargetBox(orders, boxes, barcode, quantity);
    if (!targetBox) {
      throw new Error("No Available Boxes");
    }
    const box = await Box.findOne({ number: targetBox.number }).session(
      session
    );

    const orderToPut = orders.find(
      (order) => order.orderNumber === targetBox.orderNumber
    );

    if (!box.order) {
      box.order = orderToPut;
    }

    //If the item already exists sum it's quantities else push it in
    const existingItem = box.scannedItems.findIndex(
      (item) => item.barcode === barcode
    );

    if (existingItem !== -1) {
      box.scannedItems[existingItem].quantity =
        box.scannedItems[existingItem].quantity + 1;
    } else {
      box.scannedItems.push({ barcode, quantity });
    }
    await box.save({ session });
    return box;
  } catch (error) {
    throw error;
  }
}

function determineTargetBox(orders, boxes, barcode, quantity) {
  const scannedItemOrder = [];
  const fullBoxes = [];
  const emptyBoxes = [];
  let boxToScan;

  //Check through the boxes to populate the fullBoxes and emptyBoxes array (meaning they have/not an order inside already)
  boxes.forEach((box) => {
    box.order ? fullBoxes.push(box) : emptyBoxes.push(box);
  });

  //Find orders that can be fulfilled with the scanned barcode and quantity
  //TODO quantity
  orders.forEach((order) => {
    const foundItem = order.items.find((item) => item.barcode === barcode);
    if (!foundItem) {
      console.log("No item found in checkBoxAvailability 229");
    } else {
      scannedItemOrder.push(order);
    }
  });

  //Find the box where you've already scanned an order from your picklist
  const assignedBox = fullBoxes.find(
    (box) => box.order.orderNumber === scannedItemOrder[0].orderNumber
  );

  //If the order is still not assigned
  if (!assignedBox) {
    //Assign the first empty box
    if (emptyBoxes.length > 0) {
      boxToScan = emptyBoxes[0].number;
    }
  } else {
    //Pass on the already assigned box
    boxToScan = assignedBox.number;
  }

  if (!boxToScan) return 0;

  return { number: boxToScan, orderNumber: scannedItemOrder[0].orderNumber };
}

const moveItemBins = async (itemsData, originalLocation, targetLocation) => {
  const session = await startSession();

  try {
    const barcodes = itemsData.map((item) => item.barcode);
    const items = await findItemsByBarcodes(barcodes, session);

    await updateItemLocations(items, itemsData, originalLocation);

    const originalBin = await findBinByName(originalLocation, session);
    const targetBin = await findBinByName(targetLocation, session);

    await updateBinItems(targetBin, items, itemsData);

    for (const itemData of itemsData) {
      const existingOriginalBinItemIndex = originalBin.items.findIndex(
        (item) => item.barcode === itemData.barcode
      );
      if (existingOriginalBinItemIndex !== -1) {
        if (
          originalBin.items[existingOriginalBinItemIndex].quantity >
          itemData.quantity
        ) {
          originalBin.items[existingOriginalBinItemIndex].quantity -=
            itemData.quantity;
          if (originalBin.items[existingOriginalBinItemIndex].quantity <= 0) {
            originalBin.items.splice(existingOriginalBinItemIndex, 1);
          }
        }
      }
    }

    await originalBin.save();
    await targetBin.save();
    await commitAndEndSession(session);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  addItemToBin,
  removeItemFromBin,
  moveItemBins,
  ScanInItem,
};
