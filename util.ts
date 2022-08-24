import fetch from "node-fetch";

import { readFileSync } from "fs";
// import openAPI_key from "./config.json"; // FIXME: 가져오기 오류

let openAPI_key = JSON.parse(readFileSync("./config.json", "utf-8"))["openAPI_key"];

class OpenAPI {
    static async getSchoolCode(school_name: string): Promise<string> {
        let qs: string = new URLSearchParams({
            "KEY": openAPI_key.toString(), 
            "Type": "json", 
            "SCHUL_NM": school_name,
        }).toString();

        let res = await fetch("https://open.neis.go.kr/hub/schoolInfo?"+qs);
        let data = JSON.parse(await res.text());

        if (data.result.code === "INFO-200")
            return "ERR_NF";
        if (data.result.code === "ERROR-500")
            return "ERR_SE";
        
        return data.schoolInfo[1].row[0].SD_SCHUL_CODE;
    }
}

class DatabaseIO {

}

export { OpenAPI, DatabaseIO }