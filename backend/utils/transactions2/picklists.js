const mongoose = require("mongoose");
const Picklist = require("../../models/picklists");
const Box = require("../../models/orderBoxes");
const Order = require("../../models/customerOrders");
const transactions = require("../transactions");

const scanInItem = async (picklistNumber, barcode, quantity) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const picklist = await Picklist.findOne({ picklistNumber }).session(
      session
    );
    if (!picklist) {
      throw new Error("Picklist not found");
    }
    console.log("items to scan in", picklist.items);

    const itemInPicklist = picklist.items.find(
      (item) => item.barcode === barcode
    );
    console.log("item being scanned in :", itemInPicklist);
    if (!itemInPicklist) {
      throw Error("No such item in picklist");
    }

    // Decrement the item quantity
    if (itemInPicklist.quantity < quantity) {
      throw new Error("Quantity to scan exceeds available quantity");
    }
    itemInPicklist.quantity -= quantity;

    // Remove the item if its quantity is zero
    if (itemInPicklist.quantity === 0) {
      picklist.items = picklist.items.filter(
        (item) => item.barcode !== barcode
      );
    }

    const newlySavedBin = await transactions.removeItemFromBin(
      [{ barcode, quantity }],
      itemInPicklist.location
    );
    console.log({ newlySavedBin });
    const boxAfterSave = await assignToBox(
      picklist.orders,
      barcode,
      quantity,
      session
    );

    // Save the picklist or delete it if no items are left
    if (picklist.items.length === 0) {
      await Picklist.deleteOne({ picklistNumber }).session(session);
    } else {
      await picklist.save({ session });
    }
    //removeFromBin
    if (!boxAfterSave || boxAfterSave === 0) {
      throw new Error("No Available Boxes");
    }

    await session.commitTransaction();
    session.endSession();
    return { item: itemInPicklist, box: boxAfterSave };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Error in scan in item : ${error}`);
  }
};

async function assignToBox(orders, barcode, quantity, session) {
  try {
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

    const existingItem = box.scannedItems.findIndex(
      (item) => item.barcode === barcode
    );

    if (existingItem !== -1) {
      box.scannedItems[existingItem].quantity += quantity;
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

  boxes.forEach((box) => {
    box.order ? fullBoxes.push(box) : emptyBoxes.push(box);
  });

  orders.forEach((order) => {
    const foundItem = order.items.find((item) => item.barcode === barcode);
    if (foundItem) {
      scannedItemOrder.push(order);
    }
  });

  const assignedBox = fullBoxes.find(
    (box) => box.order.orderNumber === scannedItemOrder[0].orderNumber
  );

  if (!assignedBox) {
    if (emptyBoxes.length > 0) {
      boxToScan = emptyBoxes[0].number;
    }
  } else {
    boxToScan = assignedBox.number;
  }

  if (!boxToScan) return 0;

  return { number: boxToScan, orderNumber: scannedItemOrder[0].orderNumber };
}

async function deletePicklistByNumber(picklistNumber) {
  await Picklist.deleteOne({ picklistNumber });
}

async function deletePicklist(picklistNumber) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Step 1: Find the picklist by its picklistNumber
    const picklist = await Picklist.findOne({ picklistNumber }).session(
      session
    );
    if (!picklist) {
      throw new Error(`Picklist with number ${picklistNumber} not found.`);
    }

    // Step 2: Extract all the orders associated with the picklist
    const orderNumbers = picklist.orders.map((order) => order.orderNumber);

    // Step 3: Update each order's 'inPicklist' field to false
    await Order.updateMany(
      { orderNumber: { $in: orderNumbers } },
      { $set: { inPicklist: false } },
      { session }
    );

    // Step 4: Delete the picklist
    await Picklist.deleteOne({ picklistNumber }).session(session);

    // Step 5: Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { message: `Picklist ${picklistNumber} deleted successfully.` };
  } catch (error) {
    // Step 6: Abort the transaction if an error occurs
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Error deleting picklist: ${error.message}`);
  }
}

async function deleteItemFromPicklist(picklistNumber, barcode, session) {
  await Picklist.updateOne(
    { picklistNumber },
    { $pull: { items: { barcode } } }
  ).session(session);
}

module.exports = {
  scanInItem,
  deletePicklistByNumber,
  deletePicklist,
};
