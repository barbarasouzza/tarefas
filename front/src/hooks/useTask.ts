// src/hooks/useTask.ts
import { useEffect, useState, useCallback } from 'react';
import { Task } from '../types/Task';
import { fetchTasks, deleteTask, updateTask } from '../services/api';

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
      await loadTasks(); // Atualiza após exclusão
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err);
    }
  };

  const updateTaskHandler = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask);
      await loadTasks(); // Atualiza após edição
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
    }
  };

  return {
    tasks,
    loading,
    error,
    removeTask,
    updateTask: updateTaskHandler,
    refetch: loadTasks, // Aqui está o `refetch`
  };
}
