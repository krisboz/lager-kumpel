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

const generatePicklists = async () => {
  const flattenedItems = [];
  const orders = [];
  let uniqueItems;
  let ordersCount = 0;

  try {
    const ordersNotInPicklists = await orderService.getNotInPicklist();
    if (ordersNotInPicklists.length === 0) {
      useNotificationStore.getState().addNotification(`No new orders`, "error");
      return;
    }
    ordersNotInPicklists.forEach(async (order) => {
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
      //await orderService.patchInPicklist(order.orderNumber);

      ordersCount++;
    });
    //console.log({ ordersNotInPicklists, flattenedItems, uniqueItems });
    const newPicklist = generatePicklist(uniqueItems);

    const response = await axios.post(baseUrl, {
      items: newPicklist,
      orders: orders,
    });
    useNotificationStore
      .getState()
      .addNotification(
        `Picklist number: ${response.data.picklistNumber} created containing ${ordersCount} orders`
      );

    return response.data;
  } catch (error) {
    console.error(error.message, error.stack);
  }
};

function generatePicklist(uniqueItems) {
  const picklist = [];
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
