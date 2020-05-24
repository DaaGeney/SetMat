import axios from "axios";
import { url } from "../../config";

export const logIn = (body,config) => {
  return axios.post(`${url}/user/login`, body,config);
};

export const registerNewUser = (body,config) => {
  return axios.post(`${url}/user/createUser`, body,config);
};

export const sendEmail = (body) => {
  return axios.post(`${url}/user/restorePassword`, body);
};

export const changePassword = (body,config) => {
  return axios.post(`${url}/user/changePassword`, body,config);
};

