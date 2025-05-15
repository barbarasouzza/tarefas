// src/components/ModalCreateTask.tsx
import React from 'react';
import CreateTaskForm from './CreateTaskForm';
import { Task } from '../types/Task';

interface ModalCreateTaskProps {
  isOpen: boolean;
  onCreate: (newTask: Task) => void | Promise<void>;
  onClose: () => void;
  onTaskCreated: () => void; // Função que será chamada após a criação da tarefa
}

const ModalCreateTask: React.FC<ModalCreateTaskProps> = ({ isOpen, onCreate, onClose, onTaskCreated }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <CreateTaskForm onCreate={onCreate} onClose={onClose} onTaskCreated={onTaskCreated} />
        <button className="modal-button" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ModalCreateTask;
