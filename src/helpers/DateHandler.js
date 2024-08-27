exports.dateHandler = (dateString, bot, chatId) => {
    try {
        // Parse the input date string into a Date object
        const inputDate = new Date(dateString);

        // Check if the date is valid
        if (isNaN(inputDate.getTime())) {
            bot.sendMessage(
                chatId,
                "Invalid date format. Please provide a valid date."
            );
            return null;
        }

        // Get the current date and current year
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Extract the month and date from the input date, and set the year to the current year
        const taskDate = new Date(
            currentYear,
            inputDate.getMonth(),
            inputDate.getDate()
        );

        // Check if the taskDate (with the current year) is in the past
        if (taskDate < currentDate) {
            bot.sendMessage(
                chatId,
                "Can't select a date in the past. Please choose a future date."
            );
            return null;
        }

        return taskDate;
    } catch (error) {
        console.log(error);
    }
};
