import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useMemo, useCallback, useEffect } from 'react';
import { useTasksActions, useTasksState } from '../context/TaskContext';
import TaskItem from './TaskItem';

export default function TaskList() {
	const { tasks, filter } = useTasksState();
	const { reorder, load } = useTasksActions();

	useEffect(() => {
		load();
	}, []); // Empty dependency array - only run once on mount

	const filtered = useMemo(() => {
		if (filter === 'completed') return tasks.filter((t) => t.completed);
		if (filter === 'pending') return tasks.filter((t) => !t.completed);
		return tasks;
	}, [tasks, filter]);

	const onDragEnd = useCallback(
		(result) => {
			const { destination, source } = result;
			if (!destination) return;
			reorder(source.index, destination.index);
		},
		[reorder]
	);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="task-list">
				{(provided) => (
					<div ref={provided.innerRef} {...provided.droppableProps} className="task-list">
						{filtered.map((task, index) => (
							<Draggable key={task._id} draggableId={task._id} index={index}>
								{(dragProvided) => (
									<div ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps}>
										<TaskItem task={task} />
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}
