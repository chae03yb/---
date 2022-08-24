import { Client } from "insta.js";
import { OpenAPI, DatabaseIO } from "./util";

import { readFileSync } from "fs";

// import { username, password } from "./config.json"; // FIXME: 가져오기 오류

const config = JSON.parse(readFileSync("./config.json", "utf-8"));

let username: string = config.username;
let password: string = config.password;

const client: Client = new Client({ disableReplyPrefix: true });

client.on("connected", () => {
    console.log("bot is online");
});

client.on("messageCreate", msg => {
    if (msg.content?.startsWith("gsc ")) {
        let school_name: string = msg.content.split(" ")[1];
        // if (gsc == "ERR_NF") // 오류 처리
        
        OpenAPI.getSchoolCode(school_name)
            .then(result => {
                if (result === "ERR_NF")
                    msg.reply("해당 학교를 찾을 수 없습니다");
                else if (result === "ERR_SE")
                    msg.reply("서버에 오류가 발생했습니다. 잠시 후에 다시 시도해주세요");
                else
                    msg.reply(`학교 코드: ${result}`);
            });
    }
});

client.login(username, password, {});