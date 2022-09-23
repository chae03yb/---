import { Client } from "@androz2091/insta.js";

import { OpenAPI } from "./OpenAPI";
import { DatabaseIO } from "./DatabaseIO";
import { ServerError, NotFoundError, InvalidKey } from "./Error";

import { username, password } from "../config.json";

const client: Client = new Client({ disableReplyPrefix: true });

client.on("connected", () => {
    console.log("bot is online");
});

client.on("messageCreate", msg => {
    if (msg.content?.startsWith("gsc ")) {
        let school_name: string = msg.content.split(" ")[1];
        
        OpenAPI.getSchoolData(school_name)
            .then(result => {
                msg.reply(`학교 코드: ${result}`);
            })
            .catch((err: Error) => {
                msg.reply(err.message);
            });
    }

    if (msg.content?.startsWith("중식")) {
        let args: Array<string> = msg.content.split(" ");
        let today: Array<string> = new Date().toJSON().split("T")[0].split("-");

        let school_name: string = args[1];
        let meal_service_date: string = args[3] === undefined ? 
            today[0]+today[1]+today[2] : args[3];

            OpenAPI.getSchoolData(school_name)
            .then(res => {

                OpenAPI.getDietInfo(res, meal_service_date, "중식")
                .then(meal_info => {
                    msg.reply(`${res.SCHUL_NM} 중식\n\n${meal_info.join("\n")}`);
                })
                .catch((err: Error) => msg.reply(err.message));

            }).catch((err: Error) => msg.reply(err.message));
    }

    if (msg.content?.startsWith("석식")) {
        let args: Array<string> = msg.content.split(" ");
        let today: Array<string> = new Date().toJSON().split("T")[0].split("-");

        let school_name: string = args[1];
        let meal_service_date: string = args[3] === undefined ? 
            today[0]+today[1]+today[2] : args[3];

            OpenAPI.getSchoolData(school_name)
            .then(res => {

                OpenAPI.getDietInfo(res, meal_service_date, "석식")
                .then(meal_info => {
                    msg.reply(`${res.SCHUL_NM} 석식\n\n${meal_info.join("\n")}`);
                })
                .catch((err: Error) => msg.reply(err.message));

            }).catch((err: Error) => msg.reply(err.message));
    }
});

client.login(username, password, {});