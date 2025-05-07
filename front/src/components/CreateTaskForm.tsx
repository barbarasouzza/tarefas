import React, { useState } from 'react';
import { createTask } from '../services/api';
import { Task } from '../types/Task';

interface CreateTaskFormProps {
  onCreate: (newTask: Task) => void | Promise<void>;
  onClose: () => void;
}


const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onCreate, onClose }) => {
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
  });

  const priorityMap = {
    'alta': 'high',
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

// src/components/CreateTaskForm.tsx
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

    await createTask(translatedTask); // só aqui faz a criação real
    await onCreate(translatedTask);   // notifica o Header
    onClose();                        // fecha o modal
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
      setFormData((prev) => ({ ...prev, custom_days: value.split(',').map((d) => d.trim()) }));
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
        <input placeholder='Nome' type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div>
        <label>Prioridade</label>
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="alta">Alta</option>
          <option value="média">Média</option>
          <option value="baixa">Baixa</option>
        </select>
      </div>

      <div>
        <label>Recorrência</label>
        <select name="recurrence" value={formData.recurrence} onChange={handleChange}>
          <option value="diária">Diária</option>
          <option value="semanal">Semanal</option>
          <option value="mensal">Mensal</option>
          <option value="personalizada">Personalizada</option>
        </select>
      </div>

      {formData.recurrence === 'custom' && (
        <div>
          <label>Dias personalizados</label>
          <textarea
            name="custom_days"
            value={formData.custom_days.join(', ')}
            onChange={handleChange}
            placeholder="Ex: segunda, quarta, sexta"
          />
        </div>
      )}

      <div>
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="pendente">Pendente</option>
          <option value="feito">Feito</option>
          <option value="não feito">Não Feito</option>
        </select>
      </div>

      <div>
        <label>Nome de usuário</label>

        <select name="username" value={formData.username} onChange={handleChange}>
          <option value="teste"></option>

        </select>
      </div>



      <div>
        <textarea placeholder='Comentário' name="comment" value={formData.comment} onChange={handleChange}></textarea>
      </div>

      <div>
        <button type="submit" disabled={isSubmitting} className="modal-button" >Criar Tarefa</button>
      </div>
    </form>
  );
};

export default CreateTaskForm;
