import { deleteTask } from '../services/api';

export const useDeleteTask = () => {
  const handleDelete = async (id: number, onSuccess: () => void) => {
    try {
      await deleteTask(id);
      onSuccess(); // Por exemplo, recarregar tarefas ou atualizar a UI
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  return { handleDelete };
};
