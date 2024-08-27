const Task = require("../model/Tasks");
const { isAuthenticated } = require("../helpers/Authentication");
const { getBot } = require("../config/config");

(async () => {
    let bot = await getBot();

    bot.onText(/\/create_task (.+) (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const telegramId = msg.from.id;

        if (!(await isAuthenticated(telegramId))) {
            return bot.sendMessage(
                chatId,
                "You need to log in first using /login command."
            );
        }

        const description = match[1];
        const dueDate = new Date(match[2]);

        try {
            const task = await Task.findOne({ telegramId });
            if (!task) {
                let data = {
                    telegramId,
                    tasks: [{ description, dueDate }],
                };
                await Task.create(data);
            } else {
                task.tasks.push({ description, dueDate });
                await task.save();
            }
            bot.sendMessage(chatId, "Task created successfully.");
        } catch (error) {
            bot.sendMessage(
                chatId,
                "There was an error creating the task. Please try again."
            );
        }
    });

    bot.onText(/\/update_task (.+) (.+) (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const telegramId = msg.from.id;
        const taskId = match[1];
        const newDescription = match[2];
        const newDueDate = new Date(match[3]);

        try {
            if (!(await isAuthenticated(telegramId))) {
                return bot.sendMessage(
                    chatId,
                    "You need to log in first using /login command."
                );
            }
            const task = await Task.findOne({ telegramId });
            if (task) {
                const record = task.tasks.find((t) => t._id === taskId);
                if (record) {
                    record.description = newDescription;
                    record.dueDate = newDueDate;
                    await task.save();
                    bot.sendMessage(chatId, "Task updated successfully.");
                } else {
                    bot.sendMessage(chatId, "Task not found.");
                }
            } else {
                bot.sendMessage(chatId, "No data found.");
            }
        } catch (error) {
            bot.sendMessage(
                chatId,
                "There was an error updating the task. Please try again."
            );
        }
    });

    // Command - /delete_task <task_id>
    bot.onText(/\/delete_task (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const telegramId = msg.from.id;
        const taskId = match[1];

        try {
            const task = await Task.findOne({ telegramId });
            if (task) {
                task.tasks.id(taskId).remove();
                await task.save();
                bot.sendMessage(chatId, "Task deleted successfully.");
            } else {
                bot.sendMessage(chatId, "No task found.");
            }
        } catch (error) {
            bot.sendMessage(
                chatId,
                "There was an error deleting the task. Please try again."
            );
        }
    });

    // Command: /list_tasks
    bot.onText(/\/list_tasks/, async (msg) => {
        const chatId = msg.chat.id;
        const telegramId = msg.from.id;

        try {
            const task = await Task.findOne({ telegramId });
            if (task && task.tasks.length > 0) {
                let taskList = "Your tasks:\n";
                task.tasks.forEach((task, index) => {
                    taskList += `${index + 1}. ${task.description} - Due: ${
                        task.dueDate
                    }\n`;
                });
                bot.sendMessage(chatId, taskList);
            } else {
                bot.sendMessage(
                    chatId,
                    "You have no tasks or you need to register first."
                );
            }
        } catch (error) {
            bot.sendMessage(
                chatId,
                "There was an error listing your tasks. Please try again."
            );
        }
    });
})();
