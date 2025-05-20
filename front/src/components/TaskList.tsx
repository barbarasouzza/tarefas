import React, { useState } from 'react';
import { Task } from '../types/Task';
import { useTasks } from '../hooks/useTask';
import ModalTaskActions from './ModalTaskActions';
import SearchBar from './SearchBar';
import { FilterModal } from './FilterModal';
import { filterTasksCombined } from '../utils/filterTasks';
import { useFilter } from '../hooks/useFilter';
import TaskItem from './TaskItem';

const useFilteredTasks = ({
  tasks,
  searchQuery,
  recurrenceFilter,
}: {
  tasks: Task[];
  searchQuery: string | null;
  recurrenceFilter: string;
}): Record<string, Task[]> => {
  const filtered = filterTasksCombined(tasks, {
    searchQuery: searchQuery && searchQuery.trim() !== '' ? searchQuery : null,
    recurrenceFilter,
  });

  return {
    all: filtered,
    daily: filtered.filter(t => t.recurrence === 'daily'),
    weekly: filtered.filter(t => t.recurrence === 'weekly'),
    monthly: filtered.filter(t => t.recurrence === 'monthly'),
    custom: filtered.filter(t => t.recurrence === 'custom'),
  };
};

const TaskList: React.FC = () => {
  const { tasks, loading, error, removeTask, updateTaskStatus, refetch } = useTasks();

  const {
    searchQuery,
    setSearchQuery,
    recurrenceFilter,
    setRecurrenceFilter,
    clearSearch,
    clearAllFilters,
  } = useFilter();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const filteredTasksMap = useFilteredTasks({
    tasks,
    searchQuery,
    recurrenceFilter,
  });

  const tasksToShow = filteredTasksMap[recurrenceFilter] || [];

  const handleTaskClick = (taskId: number) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleStatusChange = (taskId: number, status: Task['status']) => {
    updateTaskStatus(taskId, status);
  };

  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task);
    setIsActionsOpen(true);
  };

  const handleDelete = (taskId: number) => {
    removeTask(taskId);
    setIsActionsOpen(false);
  };

  if (loading) return <p>Carregando tarefas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="tasks">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={e => setSearchQuery(e.target.value)}
        onClearSearch={clearSearch}
      />


      <FilterModal
        isOpen={true}
        tasks={tasks}
        searchQuery={searchQuery}
        recurrenceFilter={recurrenceFilter}
        onSelect={value =>
          setRecurrenceFilter(prev => (prev === value ? '' : value ?? ''))
        }

        onToggleExpand={handleTaskClick}
        expandedTaskId={expandedTaskId ?? undefined}
        onStatusChange={handleStatusChange}
        onEdit={handleOpenEdit}
      />

      {selectedTask && (
        <ModalTaskActions
          task={selectedTask}
          isOpen={isActionsOpen}
          onClose={() => setIsActionsOpen(false)}
          onDelete={handleDelete}
          refreshTasks={() => {
            refetch();
            setIsActionsOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default TaskList;
