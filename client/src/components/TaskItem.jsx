import { memo, useCallback, useMemo, useState } from 'react';
import { useTasksActions } from '../context/TaskContext';

function TaskItemInner({ task }) {
	const { toggle, remove } = useTasksActions();
	const onToggle = useCallback(() => toggle(task._id), [toggle, task._id]);
	const onDelete = useCallback(() => remove(task._id), [remove, task._id]);
	const [expanded, setExpanded] = useState(false);

	const statusLabel = useMemo(() => (task.completed ? 'Completed' : 'Pending'), [task.completed]);

	const showToggle = Boolean(task.description && task.description.length > 140);

	return (
		<div className={`task-item ${task.completed ? 'completed' : ''}`}>
			<div className="task-header">
				<div className="task-text">
					<div className="task-title-row">
						<span className="task-title">{task.title}</span>
						<span className={`status-pill ${task.completed ? 'done' : 'pending'}`}>{statusLabel}</span>
					</div>
				</div>
				<div className="task-actions">
					<button
						className={`btn-complete ${task.completed ? 'undo' : 'mark'}`}
						onClick={onToggle}
						aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
						title={task.completed ? 'Mark as pending' : 'Mark as completed'}
					>
						{task.completed ? 'Undo' : 'Complete'}
					</button>
					<button className="btn-delete" onClick={onDelete} aria-label="Delete task" title="Delete task">
						Delete
					</button>
				</div>
			</div>
			{task.description ? (
				<div className="task-description-section">
					<div className="task-desc-heading">Description</div>
					<div className={`task-desc ${!expanded ? 'clamp' : ''}`}>
						{task.description}
					</div>
					{showToggle ? (
						<button
							className="desc-toggle"
							onClick={() => setExpanded((v) => !v)}
							aria-label={expanded ? 'Show less' : 'Show more'}
						>
							{expanded ? 'Show less' : 'Show more'}
						</button>
					) : null}
				</div>
			) : null}
		</div>
	);
}

export const TaskItem = memo(TaskItemInner);

export default TaskItem;
