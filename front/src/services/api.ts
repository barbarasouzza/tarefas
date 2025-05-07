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
  rating: number;
  comment: string;
}) => {
  try {
    const response = await api.post('/tasks', taskData);
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


export default api;
