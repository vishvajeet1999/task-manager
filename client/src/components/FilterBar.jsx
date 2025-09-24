import { useCallback } from 'react';
import { useTasksActions, useTasksState } from '../context/TaskContext';

export default function FilterBar() {
	const { filter } = useTasksState();
	const { setFilter } = useTasksActions();

	const handle = useCallback((f) => () => setFilter(f), [setFilter, filter]);

	return (
		<div className="filter-bar">
			<button className={`filter-btn ${filter === 'all' ? 'is-active' : ''}`} onClick={handle('all')}>
				All
			</button>
			<button className={`filter-btn ${filter === 'completed' ? 'is-active' : ''}`} onClick={handle('completed')}>
				Completed
			</button>
			<button className={`filter-btn ${filter === 'pending' ? 'is-active' : ''}`} onClick={handle('pending')}>
				Pending
			</button>
		</div>
	);
}
