const express = require('express');
const { body, param, query } = require('express-validator');
const {
	createTask,
	getTasks,
	getTask,
	updateTask,
	toggleComplete,
	deleteTask,
	reorderTasks,
} = require('../controllers/taskController');
const { validate } = require('../utils/validate');

const router = express.Router();

router.get(
	'/',
	[
		query('status').optional().isIn(['all', 'completed', 'pending']),
		query('page').optional().isInt({ min: 1 }).toInt(),
		query('limit').optional().isInt({ min: 1, max: 1000 }).toInt(),
	],
	validate,
	getTasks
);

router.post(
	'/',
	[body('title').isString().trim().notEmpty(), body('description').optional().isString()],
	validate,
	createTask
);

router.get('/:id', [param('id').isMongoId()], validate, getTask);

router.patch(
	'/:id',
	[
		param('id').isMongoId(),
		body('title').optional().isString().trim().notEmpty(),
		body('description').optional().isString(),
		body('completed').optional().isBoolean(),
	],
	validate,
	updateTask
);

router.post('/:id/toggle', [param('id').isMongoId()], validate, toggleComplete);

router.delete('/:id', [param('id').isMongoId()], validate, deleteTask);

router.post('/reorder', [body('orderedIds').isArray({ min: 1 })], validate, reorderTasks);

module.exports = router;

