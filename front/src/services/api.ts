import axios from 'axios';
import { Task } from '../types/Task';

const api = axios.create({
  baseURL: 'http://192.168.1.67:8000', // IP local da máquina
});

export const fetchTasks = async () => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tarefas', error);
    throw error;
  }
};

export const createTask = async (taskData: {
  name: string;
  priority: string;
  recurrence: string;
  custom_days: string[];
  status: string;
  username: string;
  rating?: number | null;
  comment?: string | null;
  next_due_date?: string;
  reminder_time?: string;
}) => {
  try {
    const payload = { ...taskData };

    if (payload.rating == null) delete payload.rating;
    if (payload.comment == null) delete payload.comment;

    const response = await api.post('/tasks', payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar tarefa', error);
    throw error;
  }
};

export const deleteTask = async (id: number) => {
  try {
    const response = await api.delete(`/tasks/${id}`)
    return response.data
  } catch (error) {
    console.log("Erro ao deletar tarefa", error);
    throw error;
  }

};


export const updateTask = async (updatedTask: Task) => {
  try {
    const response = await api.put(`/tasks/${updatedTask.id}`, updatedTask);
    return response.data;
  } catch (error) {
    console.error('Erro ao editar tarefa', error);
    throw error;
  }
};

// Nova função para atualizar o status de uma tarefa
export const updateTaskStatus = async (task_Id: number, status: string) => {
  try {
    const response = await api.put(`/tasks/${task_Id}/status`, { status });  // já está correto
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar status da tarefa', error);
    throw error;
  }
};

// Buscar tarefas para avaliação por username (assumindo que essa rota existe)
export const fetchEvaluationTasks = async (username: string) => {
  try {
    const response = await api.get(`/tasks/for-evaluation`, {
      params: { username }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar tarefas para avaliação", error);
    throw error;
  }
};

// Criar uma nova avaliação
export const createEvaluation = async (evaluationData: {
  task_id: number;
  username: string;
  rating: number;
  comment?: string;
}) => {
  try {
    const response = await api.post('/evaluations/', evaluationData);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar avaliação', error.response?.data || error.message);
    throw error;
  }
};

// Buscar avaliações de uma tarefa
export const fetchEvaluationsByTask = async (taskId: number) => {
  try {
    const response = await api.get(`/evaluations/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar avaliações', error);
    throw error;
  }
};

// Buscar média da avaliação de uma tarefa
export const fetchAverageRating = async (taskId: number) => {
  try {
    const response = await api.get(`/evaluations/average/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar média da avaliação', error);
    throw error;
  }
};

export const fetchUpcomingTasks = async (recurrence?: string) => {
  try {
    // Monta os params só se passar o filtro
    const params = recurrence ? { filter_by: recurrence } : {};

    const response = await api.get('/upcoming', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tarefas próximas', error);
    throw error;
  }
};



export default api;
