import binService from "../services/bins";
import itemService from "../services/items";

import useActionStore from "../zustand/useActionStore";
import useNotificationStore from "../zustand/useNotificationStore";

const populateScannedItems = (scannedItems, origin) => {
  //TODO comment it out, comment it all out
  const parsedItems = scannedItems.map((item) => item.barcode);
  if (origin.length === 0) {
    console.log("its empty");
    return [];
  } else {
    const parsedArray = origin.items.map((item) =>
      parsedItems.includes(item.barcode) ? item : null
    );
    return parsedArray.filter((item) => item);
  }
};

const addToScannedItems = (localBarcode, localQuantity, setScannedItems) => {
  const newItem = { barcode: localBarcode, quantity: +localQuantity };
  console.log("that's shoulds be addeds", newItem);

  // Get the current state of scannedItems
  const scannedItems = useActionStore.getState().scannedItems;

  const index = scannedItems.findIndex(
    (item) => item.barcode === newItem.barcode
  );

  if (localBarcode !== "") {
    if (index !== -1) {
      // If item exists, update its quantity
      const updatedItems = scannedItems.map((item, i) =>
        index === i
          ? { ...item, quantity: item.quantity + newItem.quantity }
          : item
      );
      setScannedItems(updatedItems);
    } else {
      // If item doesn't exist, add it to the list
      setScannedItems([...scannedItems, newItem]);
    }
  } else {
    // Notify user if barcode is empty
    throw Error("Error scanning an item for an action");
  }
};

const handleBinScan = async (localBarcode, state) => {
  if (state.scannedItems.length === 0) {
    return { message: "No items scanned", type: "error" };
  }
  /**
     
     *      state : action, origin, scannedItems, setters

     */

  if (state.action === "add") {
    const addedItem = await binService.addItemsToBin(
      localBarcode,
      state.scannedItems
    );
    //binservice.additems(state.scannedItems)
    console.log("ADDED ITEM", addedItem);

    if (!addedItem) {
      return {
        message: `Error adding items to ${localBarcode}`,
        type: "error",
      };
    }

    const totalScannedItemsQuantity = state.scannedItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    state.setters.setScannedItems([]);
    return {
      message: `Successfully added ${totalScannedItemsQuantity} items to ${localBarcode}`,
    };
  }

  if ((state.action === "move" || state.action === "remove") && !state.origin) {
    return { message: "You need to set an origin first", type: "error" };
  }

  if (state.action === "move") {
    if (localBarcode === state.origin.name) {
      return { message: "You can't move to the same bin", type: "error" };
    }
    try {
      const moveRes = await binService.moveItemBins(
        state.origin.name,
        state.scannedItems,
        localBarcode
      );

      state.setters.setNotification(
        `Succesfully moved ${state.scannedItems.reduce(
          (total, item) => total + item.quantity,
          0
        )} items from ${state.origin.name} to ${localBarcode}`
      );
      state.setters.setScannedItems([]);
    } catch (error) {
      state.setters.setNotification("Error moving items", "error");
    }
    return;
  }

  if (state.action === "remove") {
    if (state.origin.name !== localBarcode) {
      state.setters.setNotification(
        "Can't remove from a different bin",
        "error"
      );
      return;
    }
    try {
      const removeRes = await binService.removeItemsFromBin(
        state.origin.name,
        state.scannedItems
      );
      if (removeRes) {
        state.setters.setNotification(
          `Succesfully removed ${state.scannedItems.reduce(
            (total, item) => total + item.quantity,
            0
          )} items from ${state.origin.name}`
        );
        state.setters.setScannedItems([]);
      } else {
        state.setters.setNotification("Error removing items", "error");
      }
    } catch (error) {
      state.setters.setNotification(error.message, "error");
    }

    return;
  }
};

const handleItemScan = (code, quantity, state) => {
  //TODO check first that it exists either in items
  //or if we ever implement shipping orders that would be best
  //Actually that should be checked in the processScan function
  const temporaryCheck = true;

  if (!temporaryCheck) {
    return { message: "Unknown Item", type: "error" };
  }

  if (state.action === "add") {
    addToScannedItems(code, quantity, state.setters.setScannedItems);
    return;
  }
  if (!state.origin) {
    return { message: "You need to set the origin first", type: "error" };
  }

  const index = state.origin.items.findIndex((item) => item.barcode === code);
  if (index === -1) {
    return { message: `No such item in ${state.origin.name}`, type: "error" };
  }

  //Lastly check if the scanned quantity is smaller than the origin quantity

  const originQuantity = state.origin.items.filter(
    (el) => el.barcode === code
  )[0].quantity;
  //if it's the first item scanned take the input quantity only

  const stateQuantity = state.scannedItems.filter(
    (el) => el.barcode === code
  )[0]
    ? state.scannedItems.filter((el) => el.barcode === code)[0].quantity +
      quantity
    : quantity;

  if (stateQuantity > originQuantity) {
    return {
      message: `There isn't enough of that item in the bin ${state.origin.name},`,
      type: "error",
    };
  }

  addToScannedItems(code, quantity, state.setters.setScannedItems);
};

const processScan = async (curr, state, isBin) => {
  if (!curr.localBarcode) {
    return { message: "You need to scan something first", type: "error" };
  }

  try {
    if (isBin.length > 0) {
      if (state.scannedItems.length === 0) {
        return { message: "You need to scan an item first", type: "error" };
      }

      //It's a bin
      const binRes = await handleBinScan(curr.localBarcode, state);
      if (binRes) return { message: binRes.message, type: binRes.type };
    } else {
      //it's an item
      const scannedItem = await itemService.getOneByBarcode(curr.localBarcode);
      console.log({ scannedItem });

      if (!scannedItem) {
        return { message: "No such item found!", type: "error" };
      }
      const itemRes = handleItemScan(
        curr.localBarcode,
        curr.localQuantity,
        state
      );
      if (itemRes) return { message: itemRes.message, type: itemRes.type };
    }
  } catch (error) {
    console.error(
      "ERROR IN PROCESSSCAN, ACTIONUTILS.JS",
      error.message,
      error.stack
    );
  }
};

export default { addToScannedItems, processScan, populateScannedItems };
