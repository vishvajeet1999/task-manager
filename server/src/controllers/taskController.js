const { StatusCodes } = require('http-status-codes');
const Task = require('../models/Task');

async function createTask(req, res, next) {
	try {
		const { title, description } = req.body;
		const maxOrder = (await Task.findOne().sort({ order: -1 }))?.order ?? 0;
		const task = await Task.create({ title, description, order: maxOrder + 1 });
		return res.status(StatusCodes.CREATED).json(task);
	} catch (error) {
		next(error);
	}
}

async function getTasks(req, res, next) {
	try {
		const { status = 'all', page = 1, limit = 50, q } = req.query;
		const filter = {};
		if (status === 'completed') filter.completed = true;
		if (status === 'pending') filter.completed = false;
		if (q) {
			filter.title = { $regex: q, $options: 'i' };
		}
		const skip = (Number(page) - 1) * Number(limit);
		const [items, total] = await Promise.all([
			Task.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(Number(limit)),
			Task.countDocuments(filter),
		]);
		return res.status(StatusCodes.OK).json({ items, total, page: Number(page), limit: Number(limit) });
	} catch (error) {
		next(error);
	}
}

async function getTask(req, res, next) {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Task not found' });
		return res.status(StatusCodes.OK).json(task);
	} catch (error) {
		next(error);
	}
}

async function updateTask(req, res, next) {
	try {
		const { title, description, completed } = req.body;
		const task = await Task.findByIdAndUpdate(
			req.params.id,
			{ $set: { title, description, completed } },
			{ new: true, runValidators: true }
		);
		if (!task) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Task not found' });
		return res.status(StatusCodes.OK).json(task);
	} catch (error) {
		next(error);
	}
}

async function toggleComplete(req, res, next) {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Task not found' });
		task.completed = !task.completed;
		await task.save();
		return res.status(StatusCodes.OK).json(task);
	} catch (error) {
		next(error);
	}
}

async function deleteTask(req, res, next) {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);
		if (!task) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Task not found' });
		return res.status(StatusCodes.NO_CONTENT).send();
	} catch (error) {
		next(error);
	}
}

async function reorderTasks(req, res, next) {
	try {
		const { orderedIds } = req.body; // array of task ids in new order
		if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
			return res.status(StatusCodes.BAD_REQUEST).json({ message: 'orderedIds must be a non-empty array' });
		}
		// Assign incremental order starting from 1
		const bulk = orderedIds.map((id, index) => ({
			updateOne: {
				filter: { _id: id },
				update: { $set: { order: index + 1 } },
			},
		}));
		await Task.bulkWrite(bulk);
		const items = await Task.find({ _id: { $in: orderedIds } }).sort({ order: 1 });
		return res.status(StatusCodes.OK).json({ items });
	} catch (error) {
		next(error);
	}
}

module.exports = {
	createTask,
	getTasks,
	getTask,
	updateTask,
	toggleComplete,
	deleteTask,
	reorderTasks,
};

