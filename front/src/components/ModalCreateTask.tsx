// src/components/ModalCreateTask.tsx
import React from 'react';
import CreateTaskForm from './CreateTaskForm';
import { Task } from '../types/Task';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newTask: Task) => void | Promise<void>;
}

const ModalCreateTask: React.FC<ModalProps> = ({ isOpen, onClose, onCreate }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <CreateTaskForm onCreate={onCreate} onClose={onClose} />
        <button className="modal-button" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ModalCreateTask;
