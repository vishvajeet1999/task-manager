const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, default: '', trim: true },
		completed: { type: Boolean, default: false, index: true },
		order: { type: Number, default: 0, index: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);

