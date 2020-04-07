import axios from "axios";
import { url } from "../../config";

export const createRoom = (category,config) => {
  return axios.post(`${url}/room/createRoom`,category, config);
};

export const getRoomInfo = (id,config) => {
  return axios.get(`${url}/room/getRoom/${id}`,config)
}
