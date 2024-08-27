const TelegramBot = require("node-telegram-bot-api");
// const Agent = require("socks5-https-client/lib/Agent");
require("dotenv").config();

exports.startBot = async () => {
    let bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
        polling: true,
        // request: {
        //     agentClass: Agent,
        //     agentOptions: {
        //         socksHost: "104.207.60.119",
        //         socksPort: 3128,
        //     },
        // },
    });

    bot.on("polling_error", (error) => {
        console.error("Polling error", error);
        setTimeout(() => {
            console.log("Reconnecting...");
            bot.startPolling(); // Retry connecting
        }, 2000); // 10-second delay before retry
    });

    bot.getMe()
        .then((me) => {
            console.log(`Bot ${me.username} is connected and running.`);
        })
        .catch((error) => {
            console.error("Bot failed to connect:", error);
        });
    bot.on("message", (msg) => {
        console.log("Received message:", msg);
    });

    bot.onText(/\/start/, (msg) => {
        console.log("bot started");
        bot.sendMessage(msg.chat.id, "Welcome! Bot has started.");
    });
    return bot;
};
