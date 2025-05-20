import React, { useMemo } from 'react';
import { Task } from '../types/Task';
import { filterTasksCombined, recurrenceMap } from '../utils/filterTasks';
import TaskItem from './TaskItem';

interface FilterModalProps {
  isOpen: boolean;
  tasks: Task[];
  searchQuery: string;
  recurrenceFilter: string;
  onSelect: (value: string | null | undefined) => void;
  onToggleExpand: (taskId: number) => void;
  expandedTaskId?: number;
  onStatusChange: (taskId: number, status: Task['status']) => void;
  onEdit: (task: Task) => void;
}

const recurrenceTypes = ['all', 'daily', 'weekly', 'monthly', 'custom'];

export function FilterModal({
  isOpen,
  tasks,
  searchQuery,
  recurrenceFilter,
  onSelect,
  onToggleExpand,
  expandedTaskId,
  onStatusChange,
  onEdit,
}: FilterModalProps) {
 const filteredTasksByRecurrence = useMemo(() => {
  const map: Record<string, Task[]> = {};

  for (const type of recurrenceTypes) {
    map[type] = filterTasksCombined(tasks, {
      recurrenceFilter: type === 'all' ? undefined : type,
      searchQuery, // usa o searchQuery real
    }).sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (a.status !== 'done' && b.status === 'done') return -1;
      return 0;
    });
  }

  return map;
}, [tasks, searchQuery]);

  if (!isOpen) return null;

  const toggleFilterSection = (type: string) => {
    const isExpanded = recurrenceFilter === type;
    onSelect(isExpanded ? undefined : type);
  };

  return (
    <div className="modal-recurrence">
      <div>
        {recurrenceTypes.map(type => {
          const isExpanded = recurrenceFilter === type;
          const tasksToShow = filteredTasksByRecurrence[type] || [];

          return (
            <section
              key={type}
              role="button"
              tabIndex={0}
              aria-pressed={isExpanded}
              onClick={() => toggleFilterSection(type)}
              onKeyDown={e => {
                if (['Enter', ' '].includes(e.key)) {
                  e.preventDefault();
                  toggleFilterSection(type);
                }
              }}
              className={`filter-modal ${isExpanded ? 'expanded' : ''}`}
            >
              <div className="filter-modal-header">
                <strong>{recurrenceMap[type]}</strong> ({tasksToShow.length})
              </div>

              {isExpanded && (
                <div>
                  {tasksToShow.length === 0 ? (
                    <p>Nenhuma tarefa encontrada.</p>
                  ) : (
                    <ul>
                      {tasksToShow.map(task => (
                        <li key={task.id}>
                          <TaskItem
                            task={task}
                            expanded={expandedTaskId === task.id}
                            onToggleExpand={() => onToggleExpand(task.id!)}
                            onStatusChange={onStatusChange}
                            onEdit={onEdit}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default FilterModal;
