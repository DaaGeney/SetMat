import axios from "axios"
import { url } from "../../config";

export const infoTeam = (code,teamId,config) => {
    return axios.get(`${url}/teams/getTeam/${code}&${teamId}`,config);
}