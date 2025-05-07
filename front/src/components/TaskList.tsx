// src/components/TaskList.tsx
import React, { useState } from 'react';
import { Task } from '../types/Task';
import { useTasks } from '../hooks/useTask';
import ModalTaskActions from './ModalTaskActions';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, loading, error }) => {
  const { removeTask } = useTasks();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const priorityMap: Record<string, string> = {
    high: '!!!',
    medium: '!!',
    low: '!',
  };

  const recurrenceMap: Record<string, string> = {
    daily: 'Diária',
    weekly: 'Semanal',
    monthly: 'Mensal',
    custom: 'Personalizada',
  };

  const statusMap: Record<string, string> = {
    pending: 'Pendente',
    done: 'Feito',
    'not done': 'Não Feito',
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsActionsOpen(true);
  };

  if (loading) return <p>Carregando tarefas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <ul>
        {tasks.map((task: Task) => (
          <li
            key={task.id}
            className="task-item cursor-pointer hover:bg-gray-100 p-2 rounded"
            onClick={() => handleTaskClick(task)}
          >
            <div className="task-details space-y-1">
              <p><strong>Prioridade:</strong> {priorityMap[task.priority]}</p>
              <p><strong>Nome:</strong> {task.name}</p>
              <p><strong>Usuário:</strong> {task.username}</p>
              <p><strong>Status:</strong> {statusMap[task.status]}</p>
              <p><strong>Comentário:</strong> {task.comment}</p>
              <p><strong>Recorrência:</strong> {recurrenceMap[task.recurrence]}</p>
              <p><strong>Dias Personalizados:</strong> {task.custom_days?.join(', ') || 'N/A'}</p>
              <p><strong>Avaliação:</strong> {task.rating}</p>
            </div>
          </li>
        ))}
      </ul>

<div >

      {selectedTask && (
        <ModalTaskActions
          task={selectedTask}
          isOpen={isActionsOpen}
          onClose={() => setIsActionsOpen(false)}
          onDelete={(id) => {
            removeTask(id);
            setIsActionsOpen(false);
          }}
        />
      )}
</div>
    </>
  );
};

export default TaskList;
