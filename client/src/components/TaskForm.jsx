import { useCallback, useMemo, useState } from 'react';
import { useTasksActions } from '../context/TaskContext';

export default function TaskForm() {
	const { add } = useTasksActions();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const isValid = useMemo(() => title.trim().length > 0, [title]);

	const onSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			if (!isValid) return;
			await add(title.trim(), description.trim() || undefined);
			setTitle('');
			setDescription('');
		},
		[add, title, description, isValid]
	);

	return (
		<form className="task-form" onSubmit={onSubmit}>
			<input
				type="text"
				placeholder="Add a new task"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				aria-label="Task title"
			/>
			<input
				type="text"
				placeholder="Description (optional)"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				aria-label="Task description"
			/>
			<button type="submit" className="btn-primary" disabled={!isValid}>
				Add
			</button>
		</form>
	);
}
