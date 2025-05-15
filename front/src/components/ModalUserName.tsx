// src/components/ModalUserName.tsx

import React, { useState } from 'react';

interface ModalUserNameProps {
  isOpen: boolean;
  onClose: () => void;
  onUserNameSubmit: (userName: string) => void;
}

const ModalUserName: React.FC<ModalUserNameProps> = ({ isOpen, onClose, onUserNameSubmit }) => {
    const [userName, setUserName] = useState<string>('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userName.trim()) {
            onUserNameSubmit(userName);
            setUserName('');
        }
    };
    
    if (!isOpen) return null; 
  return (
    isOpen ? (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Digite o nome do usuário</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nome do usuário"
              required
            />
            <div>
              <button type="submit" className="modal-button">Confirmar</button>
              <button type="button" className="modal-button" onClick={onClose}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    ) : null
  );
};

export default ModalUserName;
