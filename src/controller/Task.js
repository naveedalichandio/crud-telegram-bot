const Task = require("../model/Tasks");
const { isAuthenticated } = require("../helpers/Authentication");
const { getBot } = require("../config/config");
const { dateHandler } = require("../helpers/DateHandler");
const User = require("../model/User");

(async () => {
    let bot = await getBot();

    bot.onText(/\/create_task (.+) (\d{2}\/\d{2})/, async (msg, match) => {
        const chatId = msg.chat.id;
        const telegramId = msg.from.id;

        if (!(await isAuthenticated(telegramId))) {
            return bot.sendMessage(
                chatId,
                "You need to log in first using /login command."
            );
        }

        const description = match[1];
        const dueDate = match[2];
        const formatedDate = dateHandler(dueDate, bot, chatId);

        if (formatedDate == null) {
            return;
        }

        try {
            const task = await Task.findOne({ telegramId });
            if (!task) {
                let data = {
                    telegramId,
                    tasks: [{ description, dueDate: formatedDate }],
                };
                await Task.create(data);
            } else {
                task.tasks.push({ description, dueDate: formatedDate });
                await task.save();
            }
            bot.sendMessage(chatId, "Task created successfully.");
        } catch (error) {
            console.log({ error });
            bot.sendMessage(
                chatId,
                "There was an error creating the task. Please try again.",
                error
            );
        }
    });

    bot.onText(
        /\/update_task (\S+) (.+) (\d{2}\/\d{2})/,
        async (msg, match) => {
            const chatId = msg.chat.id;
            const telegramId = msg.from.id;
            const taskId = match[1];
            const newDescription = match[2];
            const newDueDate = match[3];
            const formatedDate = dateHandler(newDueDate, bot, chatId);

            if (formatedDate == null) {
                return;
            }

            try {
                if (!(await isAuthenticated(telegramId))) {
                    return bot.sendMessage(
                        chatId,
                        "You need to log in first using /login command."
                    );
                }
                const task = await Task.findOne({ telegramId });
                if (task) {
                    const record = task.tasks.find(
                        (t) => t._id.toString() == taskId
                    );
                    if (record) {
                        record.description = newDescription;
                        record.dueDate = formatedDate;
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
        }
    );

    // Command - /delete_task <task_id>
    bot.onText(/\/delete_task (\S+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const telegramId = msg.from.id;
        const taskId = match[1];

        try {
            const task = await Task.findOne({ telegramId });
            if (task) {
                task.tasks._id(taskId).remove();
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

    const sendRemindersAndSummary = async () => {
        const users = await User.find();

        users?.forEach((user) => {
            if (user?.tasks.length > 0) {
                user.tasks.forEach((task) => {
                    const timeUntilDue = task.dueDate - new Date();
                    if (timeUntilDue <= 3600000 && timeUntilDue > 0) {
                        // 1 hour before due
                        bot.sendMessage(
                            user.telegramId,
                            `Reminder: Task "${task.description}" is due in 1 hour.`
                        );
                    }
                });

                const pendingTasks = user.tasks.filter(
                    (task) => task.dueDate > new Date()
                );
                if (pendingTasks.length > 0) {
                    let summary = "Daily Task Summary:\n";
                    pendingTasks.forEach((task, index) => {
                        summary += `${index + 1}. ${task.description} - Due: ${
                            task.dueDate
                        }\n`;
                    });
                    bot.sendMessage(user.telegramId, summary);
                }
            }
        });
    };

    // Schedule reminders and daily summaries at specific times
    setInterval(sendRemindersAndSummary, 3600000); // Run every hour
})();
