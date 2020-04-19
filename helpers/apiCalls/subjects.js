
import axios from "axios";
import { url } from "../../config";

export const getAllSubjects = (config) => {
    return axios.get(`${url}/subjects/getAllSubjects`,config);
  };


export const createSubjects = (body,config) => {
    return axios.post(`${url}/subjects/createSubject`,body,config);
  };
