import fetch from "node-fetch";

import { OPEN_API } from "../config.json";
import { 
    NotFoundError, 
    InvalidKey, 
    InvalidType, 
    ServerError, 
    School 
} from "./Definitions";

export class OpenAPI {
    static async getSchoolData(school_name: string): Promise<School> {
        let qs: string = new URLSearchParams({
            KEY: OPEN_API.KEY.toString(), 
            Type: "json", 
            SCHUL_NM: school_name,
        }).toString();

        let response = await fetch("https://open.neis.go.kr/hub/schoolInfo?"+qs);
        let data: any = await response.json();

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

    static async getDietInfo(school_data: School, meal_service_date: string, type: "중식" | "석식" = "중식"): Promise<Array<String>> {
        let qs: string = new URLSearchParams({
            KEY: OPEN_API.KEY.toString(),
            Type: "json",
            SD_SCHUL_CODE: school_data.SCHUL_CODE,
            ATPT_OFCDC_SC_CODE: school_data.ATPT_OFCDC_SC_CODE,
            MLSV_YMD: meal_service_date
        }).toString();

        let response = await fetch("https://open.neis.go.kr/hub/mealServiceDietInfo?"+qs);
        let data     = await response.json();
        try {
            let meal_info = data["mealServiceDietInfo"][1]["row"];
            let meal_service_types: Array<string> = [];

            meal_info.forEach(item => meal_service_types.push(item.MMEAL_SC_NM));

            if (meal_service_types.includes(type)) {
                let diet: Array<string> = [];
                
                meal_info.filter(item => item.MMEAL_SC_NM === type)[0]["DDISH_NM"].split("<br/>").forEach(item => {
                    if (item.indexOf("(") === -1)
                        diet.push(item)
                    else
                        diet.push(item.substring(0, item.indexOf("(")));
                });

                return diet;
            }
            else 
                throw new InvalidType("해당 시간에 급식을 제공하지 않습니다");
        }
        catch (err) {
            if (Object.keys(data).includes("mealServiceDietInfo")) {
                if (err instanceof InvalidType)
                    throw new InvalidType("해당 시간에 급식을 제공하지 않습니다");
                else
                    throw new Error("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            }
            else {
                if (data.RESULT.CODE === "INFO-200")
                    throw new NotFoundError("해당하는 데이터를 찾을 수 없습니다.");
                else if (data.RESULT.CODE === "ERROR-290")
                    throw new InvalidKey("인증키가 유효하지 않습니다.");
                else if (data.RESULT.CODE === "ERROR-500")
                    throw new ServerError("서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            }
        }
    }

    static async getDetailInfo(school_data: School, meal_service_date: string, meal_service_types: "중식" | "석식"): Promise<Object> {
        // 식단 정보 요청
        // 칼로리 정보, 영양 정보, 알레르기 정보 반환
        return {
            "CAL": 0.0, // 칼로리 정보
            "NTR": {
                // 영양소 정보
                "CRB": 0.0, // 탄수화물
                "PRT": 0.0, // 단백질
                "FAT": 0.0, // 지방
                "VIT": 0.0, // 비타민
                "THM": 0.0, // 티아민
                "RIB": 0.0, // 리보플라빈
                "VTC": 0.0, // 비타민 C
                "CAL": 0.0, // 칼슘
                "FER": 0.0  // 철분
            },
            "ALG": {
                // 알레르기 정보
            }
        };
    }
}