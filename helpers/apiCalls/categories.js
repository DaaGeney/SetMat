
import axios from "axios";
import { url } from "../../config";

export const createCategory = (category,config) => {
  return axios.post(`${url}/categories/createConcept`, category,config);
};

export const getSubjects = (config) => {
    return axios.get(`${url}/categories/getSubjects`,config);
  };
