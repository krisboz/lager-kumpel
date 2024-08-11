import axios from "axios";
import orderService from "./orders";
import useNotificationStore from "../zustand/useNotificationStore";

const baseUrl = "http://localhost:3003/api/picklists";

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("error fetching picklists", error.message);
  }
};

const getByNumber = async (picklistNumber) => {
  try {
    const response = await axios.get(`${baseUrl}/${picklistNumber}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching picklist by number", error.message);
  }
};

const generatePicklists = async (numberOfOrders = null) => {
  const flattenedItems = [];
  const orders = [];
  let ordersCount = 0;

  try {
    const ordersNotInPicklists = await orderService.getNotInPicklist();
    if (ordersNotInPicklists.length === 0) {
      useNotificationStore.getState().addNotification(`No new orders`, "error");
      return;
    }
    /**
     *    ordersNotInPicklists.forEach(async (order) => {
      orders.push(order);
      order.items.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          const newFlattenedEntry = {
            barcode: item.barcode,
            photo: item.photo,
            locations: item.locations,
            orderNumber: order.orderNumber,
          };

          flattenedItems.push(newFlattenedEntry);

          uniqueItems = flattenedItems.reduce((acc, current) => {
            const existingItem = acc.find(
              (item) => item.barcode === current.barcode
            );
            if (existingItem) {
              existingItem.quantity += 1;
            } else {
              acc.push({
                barcode: current.barcode,
                quantity: 1,
                photo: current.photo,
                locations: current.locations,
              });
            }
            return acc;
          }, []);
        }
      });

      //TODO RESET//await orderService.patchInPicklist(order.orderNumber);

      ordersCount++;
    });
     */

    //If the user wants to limit amount of orders that go into a single picklist
    if (numberOfOrders) {
      if (numberOfOrders >= ordersNotInPicklists.length) {
        orders.push(...ordersNotInPicklists);
      } else {
        orders.push(...ordersNotInPicklists.slice(0, numberOfOrders));
      }
    } else {
      orders.push(...ordersNotInPicklists);
    }

    const uniqueItems = await extricateItemsFromOrders(orders);
    const newPicklist = generatePicklist(uniqueItems);
    console.log("LOOK AT ME", newPicklist, uniqueItems);
    console.log("ORDERS", orders);

    /**
     *     ordersNotInPicklists.forEach(async (order) => {
      const uniqueItemsForOrder = order.items.reduce((acc, current) => {
        const existingItem = acc.find(
          (item) => item.barcode === current.barcode
        );
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          acc.push({
            barcode: current.barcode,
            quantity: current.quantity || 1,
            photo: current.photo,
            locations: current.locations,
          });
        }
        return acc;
      }, []);
      console.log(uniqueItemsForOrder);
      uniqueItems.push(...uniqueItemsForOrder);
      console.log(uniqueItems);
      ordersCount++;
    });
    console.log({ ordersNotInPicklists, uniqueItems });
     */
    orders.forEach(
      async (order) => await orderService.patchInPicklist(order.orderNumber)
    );

    const response = await axios.post(baseUrl, {
      items: newPicklist,
      orders: orders,
    });
    if (response) {
      useNotificationStore
        .getState()
        .addNotification(
          `Picklist number: ${response.data.picklistNumber} created containing ${orders.length} orders`
        );
    }

    return response.data;
  } catch (error) {
    console.error(error.message, error.stack);
  }
};

async function extricateItemsFromOrders(orders) {
  // To store the final result with unique items and summed quantities
  const resultArray = [];

  // Iterate over each order
  orders.forEach((order) => {
    // Iterate over each item in the current order
    order.items.forEach((current) => {
      // Find the index of the item in the result array by its barcode
      const existingItemIndex = resultArray.findIndex(
        (item) => item.barcode === current.barcode
      );
      // If the item does not exist in the result array, add it
      if (existingItemIndex === -1) {
        resultArray.push({
          barcode: current.barcode,
          quantity: current.quantity || 1,
          photo: current.photo,
          locations: current.locations,
        });
      } else {
        // If the item exists, increment the quantity
        resultArray[existingItemIndex].quantity += current.quantity || 1;
      }
    });
  });
  return resultArray;
}

function generatePicklist(uniqueItems) {
  const picklist = [];
  console.log("UNIQUE ITEMS", uniqueItems);
  uniqueItems.forEach((item) => {
    let originalQuantity = item.quantity;
    const locations = item.locations;
    //While there is still unassigned quantities of an item
    while (originalQuantity > 0) {
      //loop through all the locations of an item
      for (let i = 0; i < locations.length; i++) {
        //if it can be fulfilled just from it
        if (locations[i].quantity >= item.quantity) {
          picklist.push({
            barcode: item.barcode,
            quantity: item.quantity,
            photo: item.photo,
            location: locations[i].location,
          });
          i = locations.length + 1;
          originalQuantity = 0;
        } else {
          picklist.push({
            barcode: item.barcode,
            quantity: locations[i].quantity,
            photo: item.photo,
            location: locations[i].location,
          });
          originalQuantity -= locations[i].quantity;
        }
      }
    }
  });
  const sortedPicklist = sortByLocation(picklist);
  return sortedPicklist;
}

function sortByLocation(arr) {
  return arr.slice().sort((a, b) => {
    const locA = a.location.split("-");
    const locB = b.location.split("-");

    for (let i = 0; i < locA.length; i++) {
      if (i >= locB.length) return 1;

      const segA = locA[i];
      const segB = locB[i];

      // Separate the numeric and alphabetic parts
      let numA = "";
      let alphaA = "";
      for (let char of segA) {
        if (char >= "0" && char <= "9") {
          numA += char;
        } else {
          alphaA += char;
        }
      }

      let numB = "";
      let alphaB = "";
      for (let char of segB) {
        if (char >= "0" && char <= "9") {
          numB += char;
        } else {
          alphaB += char;
        }
      }

      // Parse numeric parts
      numA = numA ? parseInt(numA, 10) : 0;
      numB = numB ? parseInt(numB, 10) : 0;

      // Compare numeric parts
      if (numA !== numB) {
        return numA - numB;
      }

      // Compare alphabetic parts
      if (alphaA !== alphaB) {
        return alphaA.localeCompare(alphaB);
      }
    }

    return locA.length - locB.length;
  });
}

const pickItem = async (picklistNumber, barcode) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/${picklistNumber}/pick/${barcode}`
    );
    return response.data;
  } catch (error) {
    console.error("error picking an item", error);
  }
};

const scanInItem = async (picklistNumber, barcode, quantity) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/${picklistNumber}/${barcode}/${quantity}`
    );
    return response.data;
  } catch (error) {
    console.error(error.message, error.stack);
    throw new Error(error.message);
  }
};

export default {
  getAll,
  getByNumber,
  generatePicklists,
  pickItem,
  scanInItem,
};
