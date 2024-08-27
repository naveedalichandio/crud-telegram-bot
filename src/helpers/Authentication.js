const User = require("../model/User");

exports.isAuthenticated = async (telegramId) => {
    const user = await User.findOne({ telegramId });
    return user && user.isAuthenticated;
};
