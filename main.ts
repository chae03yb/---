import { Client } from "@androz2091/insta.js";
import { OpenAPI, DatabaseIO, ServerError, NotFoundError, InvalidKey } from "./util";

import { username, password } from "./config.json";

const client: Client = new Client({ disableReplyPrefix: true });

client.on("connected", () => {
    console.log("bot is online");
});

client.on("messageCreate", msg => {
    if (msg.content?.startsWith("gsc ")) {
        let school_name: string = msg.content.split(" ")[1];
        
        OpenAPI.getSchoolCode(school_name)
            .then(result => {
                msg.reply(`학교 코드: ${result}`);
            }).catch(err => {
                // FIXME: 오류 처리
                if (err instanceof NotFoundError)
                    msg.reply("해당 학교를 찾을 수 없습니다");
                if (err instanceof ServerError)
                    msg.reply("API 서버에 오류가 발생했습니다. 잠시 후에 다시 시도해주세요");
                if (err instanceof InvalidKey)
                    msg.reply("API 키가 유효하지 않습니다.");
            });
    }
});

client.login(username, password, {});