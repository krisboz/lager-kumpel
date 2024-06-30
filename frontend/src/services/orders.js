import axios from "axios";
import useNotificationStore from "../zustand/useNotificationStore";

const baseUrl = "http://localhost:3003/api/orders";

//get all

//get a single one

//get in picklist not, processed, not processed

const getNotInPicklist = async () => {
  try {
    const response = await axios.get(`${baseUrl}/not_in_picklist`);
    return response.data;
  } catch (error) {
    console.error(error.message, error);
  }
};

const patchInPicklist = async (orderNumber) => {
  try {
    const response = await axios.patch(`${baseUrl}/${orderNumber}/in_picklist`);
    return response.data;
  } catch (error) {
    console.error(error.message, error.stack);
  }
};

const patchInMorePicklists = async (orderNumbers) => {
  try {
    orderNumbers.forEach(async (number) => {
      await patchInPicklist(number);
    });
  } catch (error) {
    console.error(error.message, error.stack);
  }
};

export default {
  getNotInPicklist,
  patchInPicklist,
  patchInMorePicklists,
};

//handleItemPick
