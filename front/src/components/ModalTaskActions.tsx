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
    refreshTasks: () => void; // Função para atualizar a lista de tarefas
}

const ModalTaskActions: React.FC<ModalTaskActionsProps> = ({
    task,
    isOpen,
    onClose,
    onEdit,
    onDelete,
    refreshTasks, // Função de refresh
}) => {
    const { removeTask, updateTask } = useTasks();
    const [editedTask, setEditedTask] = useState<Task>(task);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'custom_days') {
            setEditedTask((prev) => ({
                ...prev,
                custom_days: value.split(',').map((d) => d.trim()),
            }));
        } else {
            setEditedTask((prev) => ({
                ...prev,
                [name]: name === 'rating' ? Number(value) : value,
            }));
        }
    };

    const handleClickOutside = (e: React.MouseEvent) => {
        if (e.target instanceof Element && e.target.closest('.modal-content')) {
            return;
        }
        onClose();
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

    const handleEdit = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);  // Habilita os campos para edição
    };

    const handleSave = async () => {
        try {
            if (onEdit) {
                onEdit(editedTask);
            } else {
                await updateTask(editedTask);
            }

            refreshTasks(); // Só será chamado se não houver erro acima
        } catch (error) {
            console.error('Erro ao salvar a tarefa:', error);
        } finally {
            setIsEditing(false);
            onClose();
        }
    };

    useEffect(() => {
        if (task) {
            setEditedTask(task);
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClickOutside}>
            <div className="modal-content">

                <div>
                    <h2>Detalhes da Tarefa: {task.name}</h2>

                    <div>
                        <button
                            className='modal-button'
                            onClick={handleDelete}
                        >
                            Deletar Tarefa
                        </button>


                    </div>

                    <div className='modal-overlay-input'>
                        <label htmlFor="name">Tarefa: </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={editedTask.name}
                            onChange={handleChange}
                            placeholder="Nome da Tarefa"
                            required
                            disabled={!isEditing}
                        />

                        <label htmlFor="priority">Prioridade: </label>
                        <select
                            id="priority"
                            name="priority"
                            value={editedTask.priority}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option value="high">Alta</option>
                            <option value="medium">Média</option>
                            <option value="low">Baixa</option>
                        </select>

                        <label htmlFor="username">Responsável pela tarefa:</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={editedTask.username}
                            onChange={handleChange}
                            placeholder="Nome do responsável pela tarefa"
                            disabled={!isEditing}
                        />

                        <label htmlFor="recurrence">Recorrência: </label>
                        <select
                            id="recurrence"
                            name="recurrence"
                            value={editedTask.recurrence}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option value="daily">Diária</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensal</option>
                            <option value="custom">Personalizada</option>
                        </select>

                        <label htmlFor="comment">Comentário:</label>
                        <textarea
                            id="comment"
                            name="comment"
                            value={editedTask.comment}
                            onChange={handleChange}
                            placeholder="Comentário"
                            disabled={!isEditing}
                        />
                    </div>

                    {/* Botão Editar: somente aparece quando não estamos editando */}
                    {!isEditing && (
                        <div>
                            <button className="modal-button" onClick={handleEdit}>Editar</button>
                        </div>
                    )}

                    {/* Botão Salvar: somente aparece quando estamos editando */}
                    {isEditing && (
                        <div>
                            <button className="modal-button" onClick={handleSave}>Salvar</button>
                        </div>
                    )}

                    {/* Botão Cancelar */}
                    <div>
                        <button className='modal-button' onClick={onClose}>Cancelar</button>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default ModalTaskActions;
