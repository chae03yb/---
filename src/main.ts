import { Client } from "@androz2091/insta.js";
import { OpenAPI, DatabaseIO, ServerError, NotFoundError, InvalidKey } from "./util";

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

    if (msg.content?.startsWith("gmi ")) {
        // 중식 명령어, 석식 명령어로 분리
        let args: Array<string> = msg.content.split(" ");

        let school_name       = args[1];
        let meal_type         = args[2] === undefined ? "중식" : "석식";
        let meal_service_date = args[3];
        
        (async () => {
            let school_data = await OpenAPI.getSchoolData(school_name);
            let diet_info = await OpenAPI.getDietInfo(school_data, meal_service_date, meal_type);
            
            console.log(diet_info);

            msg.reply(`${school_data.SCHUL_NM} ${meal_type}\n\n${diet_info.join("\n")}`);
        })();
    }
});

client.login(username, password, {});