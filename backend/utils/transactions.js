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
    } else {
      //THAT MEANS THE LAST ITEM WAS REMOVED, SO IT SHOULD
      //ALSO BE REMOVED FROM THE ITEM.LOCATIONS
      if (existingLocationInItem) {
        item.locations = item.locations.filter(
          (location) => location.location !== targetBin.name
        );
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
        price: currentItem.price,
        cost: currentItem.cost,
        locations: currentItem.locations,
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

const moveItemBins = async (itemsData, originalLocation, targetLocation) => {
  const session = await startSession();

  try {
    const barcodes = itemsData.map((item) => item.barcode);
    const items = await findItemsByBarcodes(barcodes, session);

    const originalBin = await findBinByName(originalLocation, session);
    const targetBin = await findBinByName(targetLocation, session);

    //Adds the items to the target  bin
    await updateBinItems(targetBin, items, itemsData);

    //Removes items from origin bin
    for (const itemData of itemsData) {
      const existingOriginalBinItemIndex = originalBin.items.findIndex(
        (item) => item.barcode === itemData.barcode
      );
      console.log("Index in original array", existingOriginalBinItemIndex);
      if (existingOriginalBinItemIndex !== -1) {
        console.log("An index has been found");

        if (
          originalBin.items[existingOriginalBinItemIndex].quantity >
          itemData.quantity
        ) {
          console.log(
            "Original bin contains more quantity than is being scanned in"
          );
          originalBin.items[existingOriginalBinItemIndex].quantity -=
            itemData.quantity;
          if (originalBin.items[existingOriginalBinItemIndex].quantity <= 0) {
            console.log("That was the original bins last quantity");
            originalBin.items.splice(existingOriginalBinItemIndex, 1);
          }
        }
        if (
          originalBin.items[existingOriginalBinItemIndex].quantity ===
          itemData.quantity
        ) {
          console.log("the last item scanned now");
          originalBin.items.splice(existingOriginalBinItemIndex, 1);
        }
      }
    }

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
