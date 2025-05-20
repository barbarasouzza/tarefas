import React, { useState } from 'react';
import { createTask } from '../services/api';
import { Task } from '../types/Task';
import AdvancedOptions from './AdvancedOptions';
import CustomDaysSelector from './CustomDaysSelector';  // <-- Importa aqui

interface CreateTaskFormProps {
  onCreate: (newTask: Task) => void | Promise<void>;
  onTaskCreated: () => void;
  onClose: () => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onCreate, onClose, onTaskCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [formData, setFormData] = useState<Task>({
    id: undefined,
    name: '',
    priority: 'medium',
    recurrence: 'daily',       // Usa valores do backend
    custom_days: [],
    status: 'pending',
    username: '',
    rating: null,
    comment: '',
    next_due_date: undefined,
    reminder_time: undefined,
  });

  // Função para atualizar custom_days
  const handleCustomDaysChange = (days: string[]) => {
    setFormData(prev => ({
      ...prev,
      custom_days: days,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createTask({
  ...formData,
  custom_days: formData.custom_days?.map(
    (day) => day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
  ),
});
      await onCreate(formData as Task);
      onTaskCreated();
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar tarefa:', error);
      if (error.response?.data) {
        console.error('Detalhes do erro:', error.response.data);
      }
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
      {/* Campos que você já tinha */}
      <div>
        <label htmlFor="name">Tarefa</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Nome da tarefa"
        />
      </div>

      <div>
        <label htmlFor="recurrence">Recorrência</label>
        <select
          id="recurrence"
          name="recurrence"
          value={formData.recurrence}
          onChange={handleChange}
        >
          <option value="daily">Diária</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensal</option>
          <option value="custom">Personalizada</option>
        </select>
      </div>

      {/* MOSTRA custom_days só se for recorrência personalizada */}
      {formData.recurrence === 'custom' && (
        <CustomDaysSelector
          selectedDays={formData.custom_days || []}
          onChange={handleCustomDaysChange}
        />
      )}

      {/* Outros campos que você já tinha */}
      <div>
        <label htmlFor="priority">Prioridade</label>
        <select
          name="priority"
          id="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={showAdvanced}
            onChange={() => setShowAdvanced(prev => !prev)}
          />
          Mostrar opções avançadas
        </label>
      </div>

      {showAdvanced && (
        <AdvancedOptions
          next_due_date={formData.next_due_date}
          reminder_time={formData.reminder_time}
          handleChange={handleChange}
        />
      )}

      <div>
        <label htmlFor="username">Responsável</label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Digite o nome do responsável"
        />
      </div>

      <div>
        <label htmlFor="comment">Comentário</label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Comentário"
        />
      </div>

      <div>
        <button className='modal-button' type="submit" disabled={isSubmitting}>
          Criar Tarefa
        </button>
      </div>
    </form>
  );
};

export default CreateTaskForm;
