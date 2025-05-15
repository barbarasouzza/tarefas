import React, { useState, useEffect } from 'react';
import { Task } from '../types/Task';
import { useTasks } from '../hooks/useTask';
import ModalTaskActions from './ModalTaskActions';
import SearchBar from './SearchBar';

// === Constantes fora do componente ===

const prioritySynonyms: Record<string, string> = {
  alta: 'high',
  urgente: 'high',
  media: 'medium',
  baixa: 'low',
};

const priorityMap: Record<string, string> = {
  high: '🟥',
  medium: '🟨',
  low: '🟩',
};

const recurrenceMap: Record<string, string> = {
  daily: 'Diária',
  weekly: 'Semanal',
  monthly: 'Mensal',
  custom: 'Personalizada',
};

const fieldLabels: Record<string, string> = {
  name: 'Tarefa',
  priority: 'Prioridade',
  username: 'Responsável pela tarefa',
  recurrence: 'Recorrência',
  comment: 'Comentário',
  rating: 'Avaliação',
};

// === Funções auxiliares fora do componente ===

function matchPrioritySynonym(query: string): string | null {
  const lowerQuery = query.toLowerCase();
  for (const [synonym, value] of Object.entries(prioritySynonyms)) {
    if (synonym.startsWith(lowerQuery)) return value;
  }
  return null;
}

function detectField(tasks: Task[], query: string): string | null {
  const lowerQuery = query.toLowerCase();

  if (matchPrioritySynonym(lowerQuery)) return 'priority';

  for (const task of tasks) {
    if (task.name.toLowerCase().includes(lowerQuery)) return 'name';
    if (task.priority.toLowerCase().includes(lowerQuery)) return 'priority';
    if (task.username.toLowerCase().includes(lowerQuery)) return 'username';
    if (recurrenceMap[task.recurrence].toLowerCase().includes(lowerQuery)) return 'recurrence';
    if (task.comment.toLowerCase().includes(lowerQuery)) return 'comment';
    if (String(task.rating).includes(lowerQuery)) return 'rating';
  }

  return null;
}

// === Subcomponente para filtros salvos ===

interface SavedFilter {
  field: string;
  value: string;
}

interface SavedFiltersProps {
  savedFilters: SavedFilter[];
  onClickFilter: (value: string) => void;
  onDeleteFilter: (index: number) => void;
}

const SavedFilters: React.FC<SavedFiltersProps> = ({ savedFilters, onClickFilter, onDeleteFilter }) => (
  <div className="filters-section">
    <span>Filtros Salvos:</span>
    <div className="filters-container">
      {savedFilters.map((filter, index) => (
        <div className="filter-pill" key={index}>
          <button onClick={() => onClickFilter(filter.value)}>
            {fieldLabels[filter.field]}:
            {filter.field === 'priority'
              ? priorityMap[filter.value] || filter.value
              : filter.field === 'recurrence'
              ? recurrenceMap[filter.value] || filter.value
              : filter.value}
          </button>
          <button onClick={() => onDeleteFilter(index)}>❌</button>
        </div>
      ))}
    </div>
  </div>
);

// === Componente principal ===

const TaskList: React.FC = () => {
  const { tasks, loading, error, removeTask, updateTaskStatus, refetch } = useTasks();

  // Estados
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  // Handlers

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedFilter(null);
  };

  const handleSaveFilter = () => {
    const field = detectField(tasks, searchQuery);
    if (searchQuery && field) {
      const value =
        field === 'priority'
          ? matchPrioritySynonym(searchQuery) || searchQuery.toLowerCase()
          : field === 'recurrence'
          ? Object.keys(recurrenceMap).find((key) =>
              recurrenceMap[key].toLowerCase().includes(searchQuery.toLowerCase())
            ) || searchQuery
          : searchQuery;

      if (value) {
        const alreadyExists = savedFilters.some((f) => f.value === value && f.field === field);
        if (!alreadyExists) {
          const updatedFilters = [...savedFilters, { field, value }];
          setSavedFilters(updatedFilters);
          localStorage.setItem('savedFilters', JSON.stringify(updatedFilters));
        }
      }
    }
    setSearchQuery('');
    setSelectedFilter(null);
  };

  const handleDeleteFilter = (indexToDelete: number) => {
    const updatedFilters = savedFilters.filter((_, index) => index !== indexToDelete);
    setSavedFilters(updatedFilters);
    localStorage.setItem('savedFilters', JSON.stringify(updatedFilters));

    if (selectedFilter && savedFilters[indexToDelete].value === selectedFilter) {
      setSelectedFilter(null);
      setSearchQuery('');
    }
  };

  const handleClickSavedFilter = (value: string) => {
    setSearchQuery(value);
    setSelectedFilter(value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedFilter(null);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsActionsOpen(true);
  };

  const handleStatusChange = async (task: Task) => {
    if (task.id !== undefined) {
      const newStatus = task.status === 'done' ? 'pending' : 'done';
      await updateTaskStatus(task.id, newStatus);
      refetch();
    }
  };

  const handleDelete = async (id: number) => {
    await removeTask(id);
    refetch();
    setIsActionsOpen(false);
  };

  // useEffect para carregar filtros salvos
  useEffect(() => {
    const saved = localStorage.getItem('savedFilters');
    if (saved) {
      setSavedFilters(JSON.parse(saved));
    }
  }, []);

  // Filtragem das tarefas
  const activeQuery = selectedFilter || searchQuery;

  const filteredTasks = activeQuery
    ? tasks.filter((task) => {
        const query = activeQuery.toLowerCase();
        const normalizedPriority = matchPrioritySynonym(query) || query;

        const normalizedRecurrence =
          Object.entries(recurrenceMap).find(([_, label]) => label.toLowerCase().includes(query))?.[0] ||
          query;

        return (
          task.name.toLowerCase().includes(query) ||
          task.priority.toLowerCase().includes(normalizedPriority) ||
          task.username.toLowerCase().includes(query) ||
          task.recurrence.toLowerCase().includes(normalizedRecurrence) ||
          task.comment.toLowerCase().includes(query) ||
          String(task.rating).includes(query)
        );
      })
    : tasks;

  // Ordenação das tarefas
  const sortedTasks = filteredTasks.sort((a, b) => {
    if (a.status === 'done' && b.status !== 'done') return 1;
    if (a.status !== 'done' && b.status === 'done') return -1;

    const priorityOrder: Record<string, number> = {
      high: 1,
      medium: 2,
      low: 3,
    };

    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (loading) return <p>Carregando tarefas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="tasks">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />

      <div className="filter-div">
        {(searchQuery || savedFilters.length > 0) && (
          <div className="filter-container">
            {searchQuery && !savedFilters.some((f) => f.value === searchQuery) && (
              <button className="save-filter-button" onClick={handleSaveFilter}>
                Deseja salvar como filtro?
              </button>
            )}

            {savedFilters.length > 0 && (
              <SavedFilters
                savedFilters={savedFilters}
                onClickFilter={handleClickSavedFilter}
                onDeleteFilter={handleDeleteFilter}
              />
            )}
          </div>
        )}
      </div>

      <ul className="tasks">
        {sortedTasks.length === 0 && activeQuery && (
          <p className="text-center text-sm text-gray-500 mt-4">Tarefa não encontrada</p>
        )}
        {sortedTasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-details">
              <div className="status-div">
                <button
                  onClick={() => handleStatusChange(task)}
                  className={`status-button ${task.status === 'done' ? 'done' : 'pending'}`}
                >
                  {task.status === 'done' ? 'Feita' : 'Pendente'}
                </button>
              </div>

              <div className="task-details" onClick={() => handleTaskClick(task)}>
                <p>{priorityMap[task.priority]}</p>
                <p>{task.name}</p>
                <p>|</p>
                <p>{task.username}</p>
                <p>|</p>
                <p>{recurrenceMap[task.recurrence]}</p>
                <p>|</p>
                <p>{task.comment}</p>
                <p>|</p>
                <p>{task.rating}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

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
