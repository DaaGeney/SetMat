import axios from "axios";
import { url } from "../../config";

export const retrieveConcepts = (config) => {
  return axios.get(`${url}/categories/retrieveConcepts`,config);
};
