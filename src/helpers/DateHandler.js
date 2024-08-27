exports.dateHandler = (dateString, bot, chatId) => {
    try {
        //  get day and month
        const [day, month] = dateString.split("/").map(Number);

        // Get the current date details
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Create a date object using the current year
        let taskDate = new Date(currentYear, month - 1, day);

        // Check if the taskDate is in the past
        if (taskDate < currentDate) {
            bot.sendMessage(
                chatId,
                "Can't select a date in the past. Please choose a future date."
            );
            return null;
        }

        return taskDate; // Return the valid task date
    } catch (error) {
        console.log(error);
    }
};
