import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { taskApi } from '../api';
import { useLocalStorage } from '../hooks/useLocalStorage';

function reducer(state, action) {
	switch (action.type) {
		case 'set':
			return { ...state, tasks: action.tasks };
		case 'add':
			return { ...state, tasks: [...state.tasks, action.task] };
		case 'update':
			return { ...state, tasks: state.tasks.map((t) => (t._id === action.task._id ? action.task : t)) };
		case 'remove':
			return { ...state, tasks: state.tasks.filter((t) => t._id !== action.id) };
		case 'filter':
			return { ...state, filter: action.filter };
		case 'loading':
			return { ...state, isLoading: action.value };
		default:
			return state;
	}
}

const TaskStateContext = createContext(undefined);
const TaskActionsContext = createContext(undefined);

export function TaskProvider({ children }) {
	const [cachedTasks, setCachedTasks] = useLocalStorage('tasks', []);
	const [state, dispatch] = useReducer(reducer, { tasks: cachedTasks, filter: 'all', isLoading: false });
	const hasLoadedRef = useRef(false);

	useEffect(() => {
		setCachedTasks(state.tasks);
	}, [state.tasks, setCachedTasks]);

	const load = useCallback(async () => {
		// Prevent multiple loads
		if (hasLoadedRef.current || state.isLoading) return;
		hasLoadedRef.current = true;
		
		dispatch({ type: 'loading', value: true });
		try {
			const data = await taskApi.list({ status: 'all', limit: 500 });
			dispatch({ type: 'set', tasks: data.items });
		} catch (error) {
			console.warn('Failed to load tasks from server:', error.message);
			// Keep using cached tasks if server is unavailable
			const storedTasks = localStorage.getItem('tasks');
			if (storedTasks) {
				try {
					const parsedTasks = JSON.parse(storedTasks);
					if (parsedTasks.length > 0) {
						dispatch({ type: 'set', tasks: parsedTasks });
					}
				} catch (parseError) {
					console.warn('Failed to parse cached tasks:', parseError);
				}
			}
		} finally {
			dispatch({ type: 'loading', value: false });
		}
	}, [state.isLoading]);

	const add = useCallback(async (title, description) => {
		try {
			const task = await taskApi.create({ title, description });
			dispatch({ type: 'add', task });
		} catch (error) {
			console.warn('Failed to create task on server:', error.message);
			// Create local task with temporary ID
			const localTask = {
				_id: Date.now().toString(),
				title,
				description,
				completed: false,
				createdAt: new Date().toISOString(),
				order: state.tasks.length + 1
			};
			dispatch({ type: 'add', task: localTask });
		}
	}, [state.tasks.length]);

	const update = useCallback(async (id, updateData) => {
		try {
			const task = await taskApi.update(id, updateData);
			dispatch({ type: 'update', task });
		} catch (error) {
			console.warn('Failed to update task on server:', error.message);
			// Update locally
			const currentTask = state.tasks.find(t => t._id === id);
			if (currentTask) {
				dispatch({ type: 'update', task: { ...currentTask, ...updateData } });
			}
		}
	}, [state.tasks]);

	const toggle = useCallback(async (id) => {
		try {
			const task = await taskApi.toggle(id);
			dispatch({ type: 'update', task });
		} catch (error) {
			console.warn('Failed to toggle task on server:', error.message);
			// Toggle locally
			const currentTask = state.tasks.find(t => t._id === id);
			if (currentTask) {
				dispatch({ type: 'update', task: { ...currentTask, completed: !currentTask.completed } });
			}
		}
	}, [state.tasks]);

	const remove = useCallback(async (id) => {
		try {
			await taskApi.remove(id);
		} catch (error) {
			console.warn('Failed to delete task on server:', error.message);
		}
		// Always remove locally
		dispatch({ type: 'remove', id });
	}, []);

	const reorder = useCallback(
		async (sourceIndex, destinationIndex) => {
			if (destinationIndex === sourceIndex) return;
			const copy = [...state.tasks];
			const [moved] = copy.splice(sourceIndex, 1);
			copy.splice(destinationIndex, 0, moved);
			dispatch({ type: 'set', tasks: copy });
			
			try {
				const ids = copy.map((t) => t._id);
				const items = await taskApi.reorder(ids);
				dispatch({ type: 'set', tasks: items });
			} catch (error) {
				console.warn('Failed to reorder tasks on server:', error.message);
				// Keep local reorder
			}
		},
		[state.tasks]
	);

	const setFilter = useCallback((f) => dispatch({ type: 'filter', filter: f }), []);

	const stateValue = useMemo(() => state, [state]);
	const actionsValue = useMemo(
		() => ({ load, add, update, toggle, remove, reorder, setFilter }),
		[load, add, update, toggle, remove, reorder, setFilter]
	);

	return (
		<TaskStateContext.Provider value={stateValue}>
			<TaskActionsContext.Provider value={actionsValue}>{children}</TaskActionsContext.Provider>
		</TaskStateContext.Provider>
	);
}

export function useTasksState() {
	const ctx = useContext(TaskStateContext);
	if (!ctx) throw new Error('useTasksState must be used within TaskProvider');
	return ctx;
}

export function useTasksActions() {
	const ctx = useContext(TaskActionsContext);
	if (!ctx) throw new Error('useTasksActions must be used within TaskProvider');
	return ctx;
}
