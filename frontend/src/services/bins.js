import axios from "axios";

const baseUrl = "http://localhost:3003/api/bins";

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("error fetching bins", error.message);
  }
};

const getOneByName = async (name) => {
  try {
    const response = await axios.get(`${baseUrl}/${name}`);
    return response.data;
  } catch (error) {
    console.error("error fetching bin", error.message, error.stack);
  }
};

const createNew = async (name) => {
  try {
    const response = await axios.post(baseUrl, name);
    console.log("new created bin", response.data);
    return response.data;
  } catch (error) {
    console.error("error adding new bin", error);
  }
};

const addItemsToBin = async (bin, itemsData) => {
  try {
    const response = await axios.put(`${baseUrl}/${bin}/addItem`, itemsData);
    return response.data;
  } catch (error) {
    console.error("error adding item to bin", error);
  }
};

const moveItemBins = async (bin, itemsData, targetLocation) => {
  console.log("BIN BEING CALLED", targetLocation);
  try {
    const response = await axios.put(`${baseUrl}/${bin}/moveItems`, {
      itemsData,
      targetLocation,
    });
    return response.data;
  } catch (error) {
    console.error("error moving items", error);
    throw error;
  }
};

const removeItemsFromBin = async (bin, itemsData) => {
  console.log(bin, itemsData);
  try {
    const response = await axios.delete(`${baseUrl}/${bin}/removeItem`, {
      data: itemsData,
    });
    return response.data;
  } catch (error) {
    console.error(error.message, error);
  }
};

export default {
  getAll,
  getOneByName,
  createNew,
  addItemsToBin,
  moveItemBins,
  removeItemsFromBin,
};
