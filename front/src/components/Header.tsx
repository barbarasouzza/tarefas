// src/components/Header.tsx
import React, { useState } from 'react';
import ModalCreateTask from './ModalCreateTask';
import ModalUserName from './ModalUserName';
import ModalTaskEvaluation from './ModalTaskEvaluation'; // Importando o ModalTaskEvaluation
import { Task } from '../types/Task';

interface HeaderProps {
  onTaskCreated: () => void;
}

const Header: React.FC<HeaderProps> = ({ onTaskCreated }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null); // Armazena o nome do usuário
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false); // Controle do modal de avaliação
  const [isUserNameModalOpen, setIsUserNameModalOpen] = useState(false);


  const handleCreateTask = (newTask: Task) => {
    console.log('Tarefa criada:', newTask);
    setIsCreateOpen(false);
    onTaskCreated();
  };

  const handleUserNameSubmit = (name: string) => {
    setUserName(name);
    setIsUserNameModalOpen(false);
    setIsEvaluationOpen(true);
  };


  return (
    <header className="header">
      <h1>Tarefas</h1>

      <button className="button-createTask" onClick={() => setIsCreateOpen(true)}>
        Criar
      </button>

      <button className="button-createTask" onClick={() => setIsUserNameModalOpen(true)}>
        Avaliar Tarefas
      </button>


      <ModalCreateTask
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateTask}
        onTaskCreated={() => console.log("Tarefa criada!")}
      />

      <ModalUserName
        isOpen={isUserNameModalOpen}
        onClose={() => setIsUserNameModalOpen(false)}
        onUserNameSubmit={handleUserNameSubmit}
      />


      <ModalTaskEvaluation
        isOpen={isEvaluationOpen}
        onClose={() => setIsEvaluationOpen(false)}
        userName={userName || 'Usuário'}
      />
    </header>

  );
};

export default Header;
