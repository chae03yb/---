import fetch from "node-fetch";

// import { readFileSync } from "fs";
import { openAPI_key } from "./config.json"; // FIXME: 가져오기 오류

// let openAPI_key = JSON.parse(readFileSync("./config.json", "utf-8"))["openAPI_key"];

export class NotFoundError extends Error {};
export class ServerError   extends Error {};
export class InvalidKey    extends Error {};

TypeError

class OpenAPI {
    static getSchoolCode(school_name: string): Promise<string> {
        let qs: string = new URLSearchParams({
            "KEY": openAPI_key.toString(), 
            "Type": "json", 
            "SCHUL_NM": school_name,
        }).toString();

        let response_data;

        return fetch("https://open.neis.go.kr/hub/schoolInfo?"+qs)
            .then(data => data.json())
            .then(data => {
                response_data = data;

                return data.schoolInfo[1].row[0].SD_SCHUL_CODE;
            })
            .catch(err => {
                // FIXME: 오류 처리
                if (response_data.RESULT.CODE === "INFO-200")
                    throw NotFoundError;
                else if (response_data.RESULT.CODE === "ERROR-500")
                    throw ServerError;
                else if (response_data.RESULT.CODE === "ERROR-290")
                    throw InvalidKey;
            });
    }
}

class DatabaseIO {

}

export { 
    OpenAPI, DatabaseIO
}