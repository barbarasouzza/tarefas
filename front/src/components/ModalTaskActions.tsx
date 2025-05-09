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

    const handleEdit = async () => {
        if (onEdit) {
            onEdit(editedTask);
        } else {
            await updateTask(editedTask);
        }
        onClose();
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
                    <h2>Editar Tarefa: {task.name}</h2>

                    <div>
                        <label htmlFor="name">Tarefa</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={editedTask.name}
                            onChange={handleChange}
                            placeholder="Nome da Tarefa"
                            required
                        />

                        <label htmlFor="priority">Prioridade</label>
                        <select
                            id="priority"
                            name="priority"
                            value={editedTask.priority}
                            onChange={handleChange}
                        >
                            <option value="alta">Alta</option>
                            <option value="média">Média</option>
                            <option value="baixa">Baixa</option>
                        </select>

                        <label htmlFor="username">Usuário</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={editedTask.username}
                            onChange={handleChange}
                            placeholder="Nome do Usuário"
                        />

                        <label htmlFor="recurrence">Recorrência</label>
                        <select
                            id="recurrence"
                            name="recurrence"
                            value={editedTask.recurrence}
                            onChange={handleChange}
                        >
                            <option value="diária">Diária</option>
                            <option value="semanal">Semanal</option>
                            <option value="mensal">Mensal</option>
                            <option value="personalizada">Personalizada</option>
                        </select>

                        {/* {editedTask.recurrence === 'personalizada' && (
                            <div>
                                <label htmlFor="custom_days">Dias personalizados</label>
                                <textarea
                                    id="custom_days"
                                    name="custom_days"
                                    value={editedTask.custom_days?.join(', ') || ''}
                                    onChange={handleChange}
                                    placeholder="Ex: segunda, quarta, sexta"
                                />
                            </div>
                        )} */}

                        <label htmlFor="comment">Comentário</label>
                        <textarea
                            id="comment"
                            name="comment"
                            value={editedTask.comment}
                            onChange={handleChange}
                            placeholder="Comentário"
                        />
                    </div>

                    <div>
                        <button className='button-updateTask' onClick={handleEdit}>Salvar</button>
                        <button className='button-updateTask' onClick={handleDelete}>Excluir</button>
                        <button className='button-updateTask' onClick={onClose}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalTaskActions;
