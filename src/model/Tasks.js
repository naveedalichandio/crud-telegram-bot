const mongoose = require("mongoose");

// Defining the model
const taskSchema = new mongoose.Schema({
    telegramId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    tasks: [{ description: String, dueDate: Date }],
});

module.exports = mongoose.model("Task", taskSchema);
