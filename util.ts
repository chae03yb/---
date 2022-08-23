import fetch from "node-fetch";

import openAPI_key from "./config.json";

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
        
        return data.schoolInfo[1].row[0].SD_SCHUL_CODE;
    }
}

class DataBaseIO {

}