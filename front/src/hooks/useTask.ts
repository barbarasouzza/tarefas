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
      console.log('[FETCH TASKS] Dados recebidos da API:', data);
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
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err);
    }
  };

  const updateTaskStatusHandler = async (
    taskId: number,
    status: Task['status']
  ) => {
    try {
      await updateTaskStatus(taskId, status);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar status da tarefa:', err);
    }
  };

  const updateTaskHandler = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
    }
  };

  const addTask = async (newTask: Task): Promise<Task | null> => {
    try {
      const createdTask = await createTask(newTask);
      setTasks((prev) => [...prev, createdTask]);
      return createdTask;
    } catch (err) {
      console.error('Erro ao adicionar tarefa:', err);
      return null;
    }
  };

  return {
    tasks,
    loading,
    error,
    removeTask,
    updateTask: updateTaskHandler,
    updateTaskStatus: updateTaskStatusHandler,
    addTask,
    refetch: loadTasks,
  };
}

