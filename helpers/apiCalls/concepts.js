import axios from "axios";
import { url } from "../../config";

export const retrieveConcepts = () => {
  return axios.get(`${url}/categories/retrieveConcepts`);
};
