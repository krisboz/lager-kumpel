import axios from "axios";
import useNotificationStore from "../zustand/useNotificationStore";

const baseUrl = "https://lager-kumpel.fly.dev/api/items";

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("error getting items", error.message);
  }
};

const getOneByBarcode = async (barcode) => {
  try {
    const response = await axios.get(`${baseUrl}/exact/${barcode}`);
    return response.data;
  } catch (error) {
    console.log("error fetching an item", error);
    throw new Error("Error fetching item, try again");
  }
};

const getAllContaining = async (barcode) => {
  try {
    const response = await axios.get(`${baseUrl}/${barcode}`);
    return response.data;
  } catch (error) {
    console.error("error getting item", error.message);
  }
};

const createNew = async (item) => {
  const newItem = {
    barcode: item.barcode,
    cost: item.cost,
    name: item.name,
    description: item.description,
    price: item.price,
    date: item.date,
    photo: item.photo,
  };

  try {
    const response = await axios.post(baseUrl, newItem);
    console.log("new created item", response.data);
    useNotificationStore.getState().addNotification("Item successfully added");
    return response.data;
  } catch (error) {
    console.error("error adding new item", error);
  }
};

export default {
  getAll,
  createNew,
  getAllContaining,
  getOneByBarcode,
};
