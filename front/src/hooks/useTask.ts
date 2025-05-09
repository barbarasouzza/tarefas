import { useEffect, useState, useCallback } from 'react';
import { Task } from '../types/Task';
import { fetchTasks, deleteTask, updateTaskStatus, updateTask, createTask } from '../services/api'; // Importando a função createTask (que você deve implementar)

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Erro ao buscar tarefas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const removeTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)); // Removendo do estado diretamente
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err);
    }
  };

  const updateTaskStatusHandler = async (
    taskId: number,
    status: 'done' | 'pending' | 'not done'
  ) => {
    try {
      await updateTaskStatus(taskId, status);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar status da tarefa:', err);
    }
  };

  const updateTaskHandler = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask); // Chama o updateTask da API
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
    }
  };

  // Função para adicionar nova tarefa
  const addTask = async (newTask: Task) => {
    try {
      const createdTask = await createTask(newTask); // Adiciona a tarefa via API
      setTasks((prevTasks) => [...prevTasks, createdTask]); // Adiciona a tarefa criada no estado local
    } catch (err) {
      console.error('Erro ao adicionar tarefa:', err);
    }
  };

  return {
    tasks,
    loading,
    error,
    removeTask,
    updateTask: updateTaskHandler,
    updateTaskStatus: updateTaskStatusHandler,
    addTask, // Função de adicionar tarefa
    refetch: loadTasks, // Aqui está o `refetch`
  };
}
