import axios from "axios";
import useNotificationStore from "../zustand/useNotificationStore";

const baseUrl = "https://lager-kumpel.fly.dev/api/orders";

//get all

//get a single one

//get in picklist not, processed, not processed

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error(error.message, error.stack);
    throw error(error.message);
  }
};

const getNotInPicklist = async () => {
  try {
    const response = await axios.get(`${baseUrl}/not_in_picklist`);
    return response.data;
  } catch (error) {
    console.error(error.message, error);
  }
};

const getNotProcessed = async () => {
  try {
    const response = await axios.get(`${baseUrl}/unprocessed`);
    return response.data;
  } catch (error) {
    console.error(error.message, error);
  }
};

const postNewOrder = async (newOrder) => {
  try {
    const response = await axios.post(baseUrl, newOrder);
    return response.data;
  } catch (error) {
    console.error(error.message, error.stack);
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

const patchProcessed = async (orderNumber) => {
  try {
    const response = await axios.patch(`${baseUrl}/${orderNumber}/processed`);
    return response.data;
  } catch (error) {
    console.error(
      "Error patching processed in order",
      error.message,
      error.stack
    );
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
  getAll,
  getNotInPicklist,
  getNotProcessed,
  patchInPicklist,
  patchInMorePicklists,
  postNewOrder,
  patchProcessed,
};

//handleItemPick
