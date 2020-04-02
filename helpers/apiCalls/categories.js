
import axios from "axios";
import { url } from "../../config";

export const createCategory = category => {
  return axios.post(`${url}/categories/createConcept`, category);
};

export const getSubjects = () => {
    return axios.get(`${url}/categories/getSubjects`);
  };
