import axios from "axios";
import useNotificationStore from "../zustand/useNotificationStore";

const baseUrl = "http://localhost:3003/api/items";

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("error getting items", error.message);
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
};
