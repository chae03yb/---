/*
    [insta.js] by Androz2091
    https://github.com/androz2091/insta.js
    https://insta.js.org/#/
*/

import { Client, Message } from "@androz2091/insta.js";

import { INSTA } from "../config.json";
import { OpenAPI } from "./OpenAPI";

const client: Client = new Client({ disableReplyPrefix: true });

client.on("connected", () => {
    console.log("bot is online");
});

client.on("messageCreate", (msg: Message) => {
    if (msg.content?.startsWith("학교정보 ")) {
        let school_name: string = msg.content.split(" ")[1];
        
        OpenAPI.getSchoolData(school_name)
        .then(result => {
            // console.log(result);
            msg.reply(`학교 정보\n 학교 코드: ${result.SCHUL_CODE}\n교육청 코드: ${result.ATPT_OFCDC_SC_CODE}`);
        })
        .catch((err: Error) => {
            msg.reply(err.message);
        });
    }

    if (msg.content?.startsWith("중식")) {
        let args: Array<string> = msg.content.split(" ");
        let today: Array<string> = new Date().toJSON().split("T")[0].split("-");

        // 인자
        let school_name: string = args[1]; // 필수
        let meal_service_date: string = args[2] === undefined ? // 선택 
            today[0]+today[1]+today[2] : args[2];

            OpenAPI.getSchoolData(school_name)
            .then(res => {
                OpenAPI.getDietInfo(res, meal_service_date, "중식")
                .then(meal_info => {
                    msg.reply(`${res.SCHUL_NM} 중식\n\n${meal_info.join("\n")}\n\n`);
                })
                .catch((err: Error) => msg.reply(err.message));

            }).catch((err: Error) => msg.reply(err.message));
    }

    if (msg.content?.startsWith("석식")) {
        let args : Array<string> = msg.content.split(" ");
        let today: Array<string> = new Date().toJSON().split("T")[0].split("-");

        // 인자
        let school_name: string = args[1]; // 필수
        let meal_service_date: string = args[2] === undefined ? // 선택 
            today[0]+today[1]+today[2] : args[2];

            OpenAPI.getSchoolData(school_name)
            .then(res => {
                OpenAPI.getDietInfo(res, meal_service_date, "석식")
                .then(meal_info => {
                    msg.reply(`${res.SCHUL_NM} 석식\n\n${meal_info.join("\n")}\n\n`);
                })
                .catch((err: Error) => msg.reply(err.message));

            }).catch((err: Error) => msg.reply(err.message));
    }
});

client.login(INSTA.USERNAME, INSTA.PASSWORD, {});
