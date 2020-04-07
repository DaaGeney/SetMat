import axios from "axios";
import { url } from "../../config";

export const logIn = (body,config) => {
  return axios.post(`${url}/user/login`, body,config);
};

export const registerNewUser = (body,config) => {
  return axios.post(`${url}/user/createUser`, body,config);
};
