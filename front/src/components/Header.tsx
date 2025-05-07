// src/components/Header.tsx
import React, { useState } from 'react';
import ModalCreateTask from './ModalCreateTask';
import { Task } from '../types/Task';

interface HeaderProps {
  onTaskCreated: () => void;
}

const Header: React.FC<HeaderProps> = ({ onTaskCreated }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateTask = (newTask: Task) => {
    console.log('Tarefa criada:', newTask);
    setIsCreateOpen(false);
    onTaskCreated();
  };

  return (
    <header className='header'>
      <h1>Tarefas</h1>
      <button className='button-createTask' onClick={() => setIsCreateOpen(true)}>
        Criar
      </button>

      <ModalCreateTask
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateTask}
      />
    </header>
  );
};

export default Header;