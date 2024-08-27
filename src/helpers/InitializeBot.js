const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

exports.startBot = async () => {
    let bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
        polling: true,
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

    bot.onText(/\/start/, (msg) => {
        console.log("bot started");
        const guideMessage =
            "Welcome to the Task Manager Bot!\n" +
            "To help you get started, follow the instructions below to use the bot commands effectively:\n\n" +
            "1. **Register:**\n" +
            "Use the `/register <username> <password>` command to create your account.\n" +
            "Example: `/register john_doe password123`\n\n" +
            "2. **Login:**\n" +
            "Once registered, log in using the `/login <username> <password>` command.\n" +
            "Example: `/login john_doe password123`\n\n" +
            "3. **Create a Task:**\n" +
            "To create a new task, use the `/create_task <description> <due_date>` command.\n" +
            "- Please provide the date in the `DD/MM` format (e.g., `19/06` for June 19th).\n" +
            "Example: `/create_task Complete_report 19/06`\n\n" +
            "4. **Update a Task:**\n" +
            "To update an existing task, use the `/update_task <task_id> <new_description> <new_due_date>` command.\n" +
            "- Ensure the date follows the `DD/MM` format.\n" +
            "Example: `/update_task 1 Update_report 20/06`\n\n" +
            "5. **Delete a Task:**\n" +
            "To delete a task, use the `/delete_task <task_id>` command.\n" +
            "Example: `/delete_task 1`\n\n" +
            "6. **List All Tasks:**\n" +
            "To view all your tasks, use the `/list_tasks` command.\n\n" +
            "Once you've familiarized yourself with these commands, you'll be able to manage your tasks effectively!";

        bot.sendMessage(msg.chat.id, guideMessage);
    });
    return bot;
};
