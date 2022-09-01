import fetch from "node-fetch";

import { openAPI_key } from "../config.json"; // FIXME: 가져오기 오류

export class NotFoundError extends Error {};
export class ServerError   extends Error {};
export class InvalidKey    extends Error {};
export class InvalidType   extends Error {};

interface SchoolData {
    SCHUL_CODE:         string,
    ATPT_OFCDC_SC_CODE: string,
    SCHUL_NM:           string
}

export class OpenAPI {
    static async getSchoolData(school_name: string): Promise<SchoolData> {
        let qs: string = new URLSearchParams({
            KEY: openAPI_key.toString(), 
            Type: "json", 
            SCHUL_NM: school_name,
        }).toString();

        let response = await fetch("https://open.neis.go.kr/hub/schoolInfo?"+qs);
        let data: any = await response.json();

        console.table(JSON.parse(JSON.stringify(data)));

        try {
            return {
                SCHUL_CODE:         data.schoolInfo[1].row[0].SD_SCHUL_CODE,
                ATPT_OFCDC_SC_CODE: data.schoolInfo[1].row[0].ATPT_OFCDC_SC_CODE,
                SCHUL_NM:           data.schoolInfo[1].row[0].SCHUL_NM
            };
        }
        catch (err) {
            if (data.RESULT.CODE === "INFO-200")
                throw new NotFoundError("해당하는 데이터를 찾을 수 없습니다.");
            else if (data.RESULT.CODE === "ERROR-290")
                throw new InvalidKey("인증키가 유효하지 않습니다.");
            else if (data.RESULT.CODE === "ERROR-500")
                throw new ServerError("서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            else
                throw new Error("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    static async getDietInfo(school_data: SchoolData, meal_service_date: string, type: string = "중식"): Promise<Array<String>> {
        let qs: string = new URLSearchParams({
            KEY: openAPI_key.toString(),
            Type: "json",
            SD_SCHUL_CODE: school_data.SCHUL_CODE,
            ATPT_OFCDC_SC_CODE: school_data.ATPT_OFCDC_SC_CODE,
            MLSV_YMD: meal_service_date
        }).toString();

        let response = await fetch("https://open.neis.go.kr/hub/mealServiceDietInfo?"+qs);
        let data = await response.json();

        console.log(JSON.stringify(data));

        try {
            let lunch  = data["mealServiceDietInfo"][1]["row"].filter(item => item.MMEAL_SC_NM === "중식")["DDISH_NM"].split("<br/>");
            let dinner = data["mealServiceDietInfo"][1]["row"].filter(item => item.MMEAL_SC_NM === "석식")["DDISH_NM"].split("<br/>");

            if (type === "중식")
                return lunch
            else if (type === "석식")
                return dinner
            else
                throw new InvalidType("올바른 식사 시간을 입력해주세요");
        }
        catch (err) {
            if (err instanceof TypeError && data.RESULT.CODE === "INFO-200")
                throw new NotFoundError("해당하는 데이터를 찾을 수 없습니다.");
            else if (data.RESULT.CODE === "ERROR-290")
                throw new InvalidKey("인증키가 유효하지 않습니다.");
            else if (data.RESULT.CODE === "ERROR-500")
                throw new ServerError("서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            else
                throw new Error("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }
}

export class DatabaseIO {

}