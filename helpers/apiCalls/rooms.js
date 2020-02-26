import axios from "axios";
import { url } from "../../config";

export const createRoom = category => {
  return axios.post(`${url}/room/createRoom`, category);
};
