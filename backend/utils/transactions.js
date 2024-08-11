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

const updateItemLocations = async (items, targetBin, originBin = null) => {
  for (const item of items) {
    if (originBin) {
      const itemInOriginBin = originBin.items.find(
        (binItem) => binItem.barcode === item.barcode
      );
      const existingLocationInItem = item.locations.find(
        (location) => location.location === originBin.name
      );

      if (itemInOriginBin) {
        const location = originBin.name;
        const quantity = itemInOriginBin.quantity;

        existingLocationInItem.quantity = quantity;

        console.log("NEWLY CHANGED", item.locations);
      } else {
        item.locations = item.locations.filter(
          (location) => location.location !== originBin.name
        );
      }
    }

    const itemInTargetBin = targetBin.items.find(
      (binItem) => binItem.barcode === item.barcode
    );

    const existingLocationInItem = item.locations.find(
      (location) => location.location === targetBin.name
    );

    if (itemInTargetBin) {
      const location = targetBin.name;
      const quantity = itemInTargetBin.quantity;

      if (existingLocationInItem) {
        existingLocationInItem.quantity = quantity;
      } else {
        item.locations.push({ location, quantity });
      }

      console.log("NEWLY CHANGED", item.locations);
    } else {
      //THAT MEANS THE LAST ITEM WAS REMOVED, SO IT SHOULD
      //ALSO BE REMOVED FROM THE ITEM.LOCATIONS
      if (existingLocationInItem) {
        item.locations = item.locations.filter(
          (location) => location.location !== targetBin.name
        );

        console.log("LOCATION REMOVED", item.locations);
      }
    }
    await item.save();
  }
};

const updateBinItems = async (bin, items, itemsData) => {
  console.log("updateBinItems args: ", { bin, items, itemsData });
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
    console.log("ITEMS", { items, itemsData });

    //await updateItemLocations(items, itemsData, binName, bin);
    await updateBinItems(bin, items, itemsData);
    await updateItemLocations(items, bin);

    await bin.save();

    await commitAndEndSession(session);
    return bin;
  } catch (error) {
    //await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const removeItemFromBin = async (
  itemsData,
  binName,
  existingSession = null
) => {
  const session = existingSession || (await startSession());

  try {
    const bin = await findBinByName(binName, session);
    const barcodes = itemsData.map((item) => item.barcode);
    const items = await findItemsByBarcodes(barcodes, session);

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

    await updateItemLocations(items, bin);

    await bin.save();

    await commitAndEndSession(session);
    return bin;
  } catch (error) {
    if (!existingSession) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

const deletePicklistByNumber2 = async (
  picklistNumber,
  existingSession = null
) => {
  const session = existingSession || (await startSession());
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
    if (!existingSession) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

const deleteItemFromPicklist2 = async (
  picklistNumber,
  barcode,
  existingSession = null
) => {
  const session = existingSession || (await startSession());

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

    if (!existingSession) {
      await commitAndEndSession(session);
    }

    return { message: "Item deleted successfully from picklist", picklist };
  } catch (error) {
    if (!existingSession) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

const ScanInItem2 = async (picklistNumber, barcode, quantity) => {
  const session = await startSession();

  try {
    const picklist = await Picklist.findOne({ picklistNumber }).session(
      session
    );

    const itemIndex = picklist.items.findIndex(
      (item) => item.barcode === barcode
    );

    if (itemIndex === -1) {
      throw new Error("Item not found in picklist");
    }

    const item = picklist.items[itemIndex];
    const itemsData = [{ barcode, quantity }];
    console.log("item in picklist", { item, itemsData });

    if (picklist.items.length === 0) {
      await deletePicklistByNumber(picklistNumber);
    } else {
      if (item.quantity < quantity) {
        throw new Error("No such item left in picklist");
      }
      // Scanned less than available

      if (item.quantity > quantity) {
        item.quantity -= quantity;
        console.log("ther's more to be scanned");
      }
      // Scanned exactly the amount that was in the picklist
      if (item.quantity === quantity) {
        await deleteItemFromPicklist(picklistNumber, barcode);
      }
    }

    //await picklist.save({ session });

    // Last item has been scanned
    const boxAfterSave = await assignToBox(picklist, barcode, 1, session);

    if (!boxAfterSave || boxAfterSave === 0) {
      console.log("I'M here there isnt a boxAfterSave");
      throw new Error("No Available Boxes");
    }

    await removeItemFromBin(itemsData, item.location);

    // Commit the transaction
    await commitAndEndSession(session);

    return { item, box: boxAfterSave };
  } catch (error) {
    session.endSession();
    throw error;
  }
};

const ScanInItemLASTONE = async (picklistNumber, barcode, quantity) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const picklist = await Picklist.findOne({ picklistNumber }).session(
      session
    );
    if (!picklist) {
      throw new Error("Picklist not found");
    }
    console.log("Scan In Item", { picklist });
    //
    const itemInPicklist = picklist.items.find(
      (item) => item.barcode === barcode
    );
    if (!itemInPicklist) {
      throw Error("No such item in picklist");
    }

    if (itemInPicklist.quantity <= 0) {
      deleteItemFromPicklist(picklistNumber, barcode);
    } else {
      itemInPicklist.quantity -= quantity;

      //If it was the last quantity of the item scanned
      if (itemInPicklist.quantity === 0) {
        console.log("the last quantity was scanned", { itemInPicklist });
        //if it was the last quantity of the last item scanned
        if (picklist.items.length === 1) {
          console.log("DELETE THE PICKLIST");
          await deletePicklistByNumber(picklistNumber);
        } else {
          await deleteItemFromPicklist(picklistNumber, barcode);
        }
      }
    }

    //Remove the scanned quantity (1) from the picklist
    const boxAfterSave = await assignToBox(
      picklist,
      barcode,
      quantity,
      session
    );

    if (!boxAfterSave || boxAfterSave === 0) {
      console.log("I'M here there isnt a boxAfterSave");
      throw new Error("No Available Boxes");
    }
    await picklist.save();

    await session.commitTransaction();
    session.endSession();
    return { item: itemInPicklist, box: boxAfterSave };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw Error(`Error in scan in item : ${error}`);
  }
};

async function assignToBox2(picklist, barcode, quantity, session) {
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

function determineTargetBox2(orders, boxes, barcode, quantity) {
  const scannedItemOrder = [];
  const fullBoxes = [];
  const emptyBoxes = [];
  let boxToScan;

  //Check through the boxes to populate the fullBoxes and emptyBoxes array (meaning they have/not an order inside already)
  boxes.forEach((box) => {
    box.order ? fullBoxes.push(box) : emptyBoxes.push(box);
  });

  //Find orders that can be fulfilled with the scanned barcode and quantity
  orders.forEach((order) => {
    const foundItem = order.items.find((item) => item.barcode === barcode);
    if (foundItem) {
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

const ScanInItem3 = async (picklistNumber, barcode, quantity) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const picklist = await Picklist.findOne({ picklistNumber }).session(
      session
    );
    if (!picklist) {
      throw new Error("Picklist not found");
    }
    console.log("Scan In Item", { picklist });

    const itemInPicklist = picklist.items.find(
      (item) => item.barcode === barcode
    );
    if (!itemInPicklist) {
      throw Error("No such item in picklist");
    }

    itemInPicklist.quantity -= quantity;

    if (itemInPicklist.quantity === 0) {
      console.log("the last quantity was scanned", { itemInPicklist });
      if (picklist.items.length === 1) {
        console.log("DELETE THE PICKLIST");
        await deletePicklistByNumber(picklistNumber, session);
      } else {
        await deleteItemFromPicklist(picklistNumber, barcode, session);
      }
    }

    const boxAfterSave = await assignToBox(
      picklist,
      barcode,
      quantity,
      session
    );

    if (!boxAfterSave || boxAfterSave === 0) {
      console.log("I'M here there isnt a boxAfterSave");
      throw new Error("No Available Boxes");
    }

    await picklist.save({ session });
    await session.commitTransaction();
    session.endSession();

    return { item: itemInPicklist, box: boxAfterSave };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Error in scan in item : ${error}`);
  }
};

async function assignToBoxLASTONE(picklist, barcode, quantity, session) {
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

function determineTargetBoxLASTONE(orders, boxes, barcode, quantity) {
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

async function deletePicklistByNumberlastone(picklistNumber, session) {
  await Picklist.deleteOne({ picklistNumber }).session(session);
}

async function deleteItemFromPicklistlastone(picklistNumber, barcode, session) {
  await Picklist.updateOne(
    { picklistNumber },
    { $pull: { items: { barcode } } }
  ).session(session);
}

const moveItemBins = async (itemsData, originalLocation, targetLocation) => {
  const session = await startSession();

  try {
    const barcodes = itemsData.map((item) => item.barcode);
    const items = await findItemsByBarcodes(barcodes, session);

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

    //TODO needs to somehow minus and plus by itself
    //Maybe sends both original and target
    await updateItemLocations(items, targetBin, originalBin);
    console.log(items);

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
};
