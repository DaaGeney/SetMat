import axios from "axios";
import { url } from "../../config";

export const logIn = body => {
  return axios.post(`${url}/user/login`, body);
};

export const registerNewUser = body => {
  return axios.post(`${url}/user/createUser`, body);
};
