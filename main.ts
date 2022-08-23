import { Client } from "@androz2091/insta.js";

const client: Client = new Client({ disableReplyPrefix: true });

client.on("connected", () => {
    console.log("bot is online");
});

client.on("messageCreate", msg => {
    if (msg.content?.startsWith("gsc ")) {

        // if (gsc == "ERR_NF") // 오류 처리
        
    }
});