import axios from "axios";
import orderService from "./orders";
import useNotificationStore from "../zustand/useNotificationStore";

const baseUrl = "http://localhost:3003/api/boxes";

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("error fetching picklists", error.message);
  }
};

const resetBox = async (boxNumber) => {
  try {
    console.log("called the reset");
    const response = await axios.put(`${baseUrl}/${boxNumber}/reset`);
    console.log({ response });
    return response.data;
  } catch (error) {
    console.error("Error reseting box in FE", error.message, error.stack);
  }
};

export default {
  getAll,
  resetBox,
};
