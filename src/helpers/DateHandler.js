exports.dateHandler = (dateString, bot, chatId) => {
    try {
        // Split the date string into day and month
        const [day, month] = dateString.split("/").map(Number);

        // Validate day and month
        if (
            isNaN(day) ||
            isNaN(month) ||
            day < 1 ||
            day > 31 ||
            month < 1 ||
            month > 12
        ) {
            bot.sendMessage(
                chatId,
                "Invalid date format. Please provide a valid date in DD/MM format."
            );
            return null;
        }

        // Get the current date and year
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Create a new date object with the current year
        const taskDate = new Date(currentYear, month - 1, day); // month is 0-based in JavaScript

        // Check if the taskDate is in the past
        if (taskDate < currentDate) {
            bot.sendMessage(
                chatId,
                "Can't select a date in the past. Please choose a future date."
            );
            return null; // Return null to indicate an invalid date
        }

        return taskDate; // Return the valid task date
    } catch (error) {
        console.log(error);
        bot.sendMessage(chatId, "An error occurred while processing the date.");
        return null;
    }
};
