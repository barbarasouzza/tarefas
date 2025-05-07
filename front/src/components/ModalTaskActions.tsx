// src/components/ModalTaskActions.tsx
import React, { useState, useEffect } from 'react';
import { Task } from '../types/Task';
import { useTasks } from '../hooks/useTask';

interface ModalTaskActionsProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (task: Task) => void;
    onDelete?: (id: number) => void;
}

const ModalTaskActions: React.FC<ModalTaskActionsProps> = ({
    task,
    isOpen,
    onClose,
    onEdit,
    onDelete,
}) => {
    const { removeTask, updateTask } = useTasks();
    const [editedTask, setEditedTask] = useState<Task>(task);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDelete = async () => {
        if (task.id) {
            if (onDelete) {
                onDelete(task.id);
            } else {
                await removeTask(task.id);
            }
        } else {
            console.error('ID da tarefa não encontrado');
        }
        onClose();
    };

    const handleEdit = async () => {
        if (onEdit) {
            onEdit(editedTask);
        } else {
            await updateTask(editedTask);
        }
        onClose();
    };

    useEffect(() => {
        setEditedTask(task);
    }, [task, isOpen]);

    if (!isOpen) return null;

    return (


        <div className="modal-overlay">
            <div className="modal-content">
                <div>
                    <h2 >Editar Tarefa: {task.name}</h2>

                    <div >
                        <input
                            type="text"
                            name="name"
                            value={editedTask.name}
                            onChange={handleChange}

                            placeholder="Nome da Tarefa"
                        />
                        <input
                            type="text"
                            name="priority"
                            value={editedTask.priority}
                            onChange={handleChange}

                            placeholder="Prioridade"
                        />
                        <input
                            type="text"
                            name="username"
                            value={editedTask.username}
                            onChange={handleChange}

                            placeholder="Nome do Usuário"
                        />
                        <input
                            type="text"
                            name="status"
                            value={editedTask.status}
                            onChange={handleChange}

                            placeholder="Status"
                        />
                        <input
                            type="text"
                            name="recurrence"
                            value={editedTask.recurrence}
                            onChange={handleChange}

                            placeholder="Recorrência"
                        />
                        <input
                            type="text"
                            name="comment"
                            value={editedTask.comment}
                            onChange={handleChange}

                            placeholder="Comentário"
                        />
                    </div>

                    <div >
                        <button

                            onClick={handleEdit}
                        >
                            Salvar
                        </button>
                        <button
                            onClick={handleDelete}
                        >
                            Excluir
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalTaskActions;
