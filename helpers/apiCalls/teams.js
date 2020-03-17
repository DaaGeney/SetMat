import axios from "axios"
import { url } from "../../config";

export const infoTeam = (code,teamId) => {
    return axios.get(`${url}/teams/getTeam/${code}&${teamId}`);
}