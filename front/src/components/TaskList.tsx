import React, { useState } from 'react';
import { Task } from '../types/Task';
import { useTasks } from '../hooks/useTask';
import ModalTaskActions from './ModalTaskActions';

const TaskList: React.FC = () => {
  const { tasks, loading, error, removeTask, updateTaskStatus } = useTasks();

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

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsActionsOpen(true);
  };

  const handleStatusChange = async (task: Task) => {
    if (task.id !== undefined) {
      const newStatus = task.status === 'done' ? 'pending' : 'done'; // Alterna entre 'feito' e 'pendente'
      await updateTaskStatus(task.id, newStatus);
    } else {
      console.error('ID da tarefa não encontrado');
    }
  };

  if (loading) return <p>Carregando tarefas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <ul>
        {tasks.map((task: Task) => (
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
                <p>{task.username}</p>
                <p>{recurrenceMap[task.recurrence]}</p>
                <p>{task.comment}</p>
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
          onDelete={(id) => {
            removeTask(id);
            setIsActionsOpen(false);
          }}
        />
      )}
    </>
  );
};

export default TaskList;
