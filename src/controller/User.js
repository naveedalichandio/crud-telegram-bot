const bcrypt = require("bcrypt");
const User = require("../model/User");
const { getBot } = require("../config/config");

const saltRounds = 10;

(async () => {
    let bot = await getBot();

    // Command: /register <username> <password>
    bot.onText(/\/register (.+) (.+)/, async (msg, match) => {
        console.log("register called");
        const chatId = msg.chat.id;
        const telegramId = msg.from.id;
        const username = match[1];
        const password = match[2];

        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                bot.sendMessage(chatId, "Username is already taken.");
            } else {
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                const newUser = {
                    telegramId,
                    username,
                    password: hashedPassword,
                };
                await User.create(newUser);
                bot.sendMessage(chatId, "Registration successful.");
            }
        } catch (error) {
            bot.sendMessage(
                chatId,
                "There was an error registering you. Please try again."
            );
        }
    });

    // Command: /login <username> <password>
    bot.onText(/\/login (.+) (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const username = match[1];
        const password = match[2];

        try {
            const user = await User.findOne({ username });
            if (!user) {
                bot.sendMessage(
                    chatId,
                    "Username not found. Please register first."
                );
            } else {
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    user.isAuthenticated = true;
                    await user.save();
                    bot.sendMessage(
                        chatId,
                        "Login successful! You can now manage your tasks."
                    );
                } else {
                    bot.sendMessage(
                        chatId,
                        "Incorrect password. Please try again."
                    );
                }
            }
        } catch (error) {
            bot.sendMessage(
                chatId,
                "There was an error logging you in. Please try again."
            );
        }
    });
})();
