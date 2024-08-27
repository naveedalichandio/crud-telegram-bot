const mongoose = require("mongoose");

// Defining the model
const taskSchema = new mongoose.Schema({
    telegramId: {
        type: String,
    },
    tasks: [{ description: String, dueDate: Date }],
});

module.exports = mongoose.model("Task", taskSchema);
