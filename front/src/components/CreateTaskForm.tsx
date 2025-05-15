import React, { useState } from 'react';
import { createTask } from '../services/api';
import { Task } from '../types/Task';

interface CreateTaskFormProps {
  onCreate: (newTask: Task) => void | Promise<void>;
  onTaskCreated: () => void;
  onClose: () => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onCreate, onClose, onTaskCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Task>({
    id: undefined,
    name: '',
    priority: 'medium',
    recurrence: 'daily',
    custom_days: [],
    status: 'pending',
    username: '',
    rating: 1,
    comment: '',
    next_due_date: "",
    reminder_time: "",
  });

  const priorityMap = {
    alta: 'high',
    média: 'medium',
    baixa: 'low',
  } as const;

  const recurrenceMap = {
    diária: 'daily',
    semanal: 'weekly',
    mensal: 'monthly',
    personalizada: 'custom',
  } as const;

  const statusMap = {
    pendente: 'pending',
    feito: 'done',
    'não feito': 'not done',
  } as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const translatedTask: Task = {
        ...formData,
        priority: priorityMap[formData.priority as keyof typeof priorityMap] || 'medium',
        recurrence: recurrenceMap[formData.recurrence as keyof typeof recurrenceMap] || 'daily',
        status: statusMap[formData.status as keyof typeof statusMap] || 'pending',
      };

      await createTask(translatedTask);
      await onCreate(translatedTask);
      onTaskCreated();
      onClose();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'custom_days') {
      setFormData((prev) => ({
        ...prev,
        custom_days: value.split(',').map((d) => d.trim()),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'rating' ? Number(value) : value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Tarefa</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder='Nome da tarefa'
        />
      </div>

      <div>
        <label htmlFor="priority">Prioridade: </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="">Selecione...</option>
          <option value="alta">Alta</option>
          <option value="média">Média</option>
          <option value="baixa">Baixa</option>
        </select>
      </div>

      <div>
        <label htmlFor="recurrence">Recorrência: </label>
        <select
          id="recurrence"
          name="recurrence"
          value={formData.recurrence}
          onChange={handleChange}
        >
          <option value="">Selecione...</option>
          <option value="diária">Diária</option>
          <option value="semanal">Semanal</option>
          <option value="mensal">Mensal</option>
          <option value="personalizada">Personalizada</option>
        </select>
      </div>

      <div>
        <label>Próxima Data</label>
        <input
          type="date"
          name="next_due_date"
          value={formData.next_due_date}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Horário do Lembrete</label>
        <input
          type="time"
          name="reminder_time"
          value={formData.reminder_time}
          onChange={handleChange}
        />
      </div>


      {/* {formData.recurrence === 'personalizada' && (
        <div>
          <label htmlFor="custom_days">Dias personalizados</label>
          <textarea
            id="custom_days"
            name="custom_days"
            value={formData.custom_days.join(', ')}
            onChange={handleChange}
            placeholder="Ex: segunda, quarta, sexta"
          />
        </div>
      )} */}

      <div>

        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Digite o nome do responsável pela tarefa"
        />
      </div>

      <div>

        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Comentário"
        />
      </div>

      <div>
        <button type="submit" disabled={isSubmitting} className="modal-button">
          Criar Tarefa
        </button>
      </div>
    </form>
  );
};

export default CreateTaskForm;
