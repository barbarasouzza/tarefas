import React from 'react';
import { Task } from '../types/Task';

const priorityMap: Record<string, string> = {
    low: '❕',
    medium: '❕',
    high: '❗',
};

const recurrenceMap: Record<string, string> = {
    daily: 'Diária',
    weekly: 'Semanal',
    monthly: 'Mensal',
    custom: 'Customizadas',
};

interface TaskItemProps {
    task: Task;
    expanded: boolean;
    onToggleExpand: () => void;
    onStatusChange: (taskId: number, status: Task['status']) => void;
    onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
    task,
    expanded,
    onToggleExpand,
    onStatusChange,
    onEdit,
}) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const formatTime = (timeString?: string) => {
        if (!timeString) return null;
        const [hour, minute] = timeString.split(':');
        return `${hour}h${minute}`;
    };

    const details = [
        { label: 'Responsável - ', value: task.username },
        {
            label: 'Repetir',
            value:
                task.recurrence === 'custom' && task.custom_days.length > 0
                    ? `${recurrenceMap[task.recurrence]} (${task.custom_days.join(', ')})`
                    : recurrenceMap[task.recurrence] || task.recurrence,
        },
        { label: 'Comentário - ', value: task.comment },
        { label: 'Prioridade -', value: priorityMap[task.priority] || task.priority },
        { label: 'Data', value: formatDate(task.next_due_date) },
        { label: 'Hora', value: formatTime(task.reminder_time) },
        { label: 'Nota', value: task.rating != null ? task.rating.toString() : null },
    ].filter(({ value }) => value !== undefined && value !== null && value !== '');

    const toggleStatus = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newStatus: Task['status'] = task.status === 'done' ? 'pending' : 'done';
        if (task.id !== undefined) {
            onStatusChange(task.id, newStatus);
        }
    };

    const handleToggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleExpand();
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(task);
    };

    return (
        <div className="task-item" key={task.id}>
            <div className="task-header">
                <button
                    className={`status-button ${task.status === 'done' ? 'status-done' : 'status-pending'}`}
                    onClick={toggleStatus}
                >
                    {task.status === 'done' ? 'Feita' : 'Pendente'}
                </button>

                <div
                    className="task-name"
                    onClick={handleToggleExpand}
                    title="Clique para ver detalhes"
                    style={{ cursor: 'pointer' }}
                >
                    {priorityMap[task.priority]} {task.name}
                </div>
            </div>

            {expanded && (
                <div className="task-body" onClick={e => e.stopPropagation()}>
                    {details.length === 0 ? (
                        <p>Nenhum detalhe disponível.</p>
                    ) : (
                        <div className="task-details-compact">
                            {details.map(({ label, value }) => (
                                <p key={label}>
                                    {/* Mostrar label só em telas maiores */}
                                    <strong className="task-label">{label} </strong>
                                    {value}
                                </p>
                            ))}
                        </div>
                    )}
                    <button className="edit-button" onClick={handleEdit}>
                        Editar
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskItem;
