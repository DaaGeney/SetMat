import axios from "axios"
import { url } from "../../config";

export const infoTeam = (code,teamId) => {
    console.log(code, "codeRoom")
    console.log(teamId, "teamId")
    return axios.get(`${url}/teams/getTeam/${code}&${teamId}`);
}