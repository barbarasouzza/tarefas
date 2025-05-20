import { Task } from '../types/Task';

// Map de tradução das recorrências
export const recurrenceMap: Record<string, string> = {
  all: 'Todos',
  daily: 'Diárias',
  weekly: 'Semanais',
  monthly: 'Mensais',
  custom: 'Customizadas',
};

// Sinônimos para prioridade
export function matchPrioritySynonym(text: string): string {
  const lower = text.toLowerCase();
  if (['alta', 'urgente'].includes(lower)) return 'high';
  if (['media', 'média', 'normal'].includes(lower)) return 'medium';
  if (['baixa', 'tranquilo'].includes(lower)) return 'low';
  return lower;
}

// Função principal para filtrar as tasks
export function filterTasksCombined(tasks: Task[], {
  recurrenceFilter,
  userFilter,
  priorityFilter,
  searchQuery,
}: {
  recurrenceFilter?: string | null;
  userFilter?: string | null;
  priorityFilter?: string | null;
  searchQuery?: string | null;
}): Task[] {

  const hasSearch = searchQuery && searchQuery.trim() !== '';

  return tasks.filter(task => {
    // Filtros diretos
    if (recurrenceFilter && recurrenceFilter !== 'all' && task.recurrence !== recurrenceFilter) {
      return false;
    }

    if (userFilter && userFilter.trim() !== '' &&
      task.username.toLowerCase() !== userFilter.toLowerCase()) {
      return false;
    }

    if (priorityFilter && priorityFilter.trim() !== '' &&
      task.priority.toLowerCase() !== priorityFilter.toLowerCase()) {
      return false;
    }

    // Filtro por texto de busca
    if (hasSearch) {
      const q = searchQuery!.toLowerCase();
      const prioritySyn = matchPrioritySynonym(q);
      const recurrenceSyn = Object.entries(recurrenceMap)
        .find(([_, label]) => label.toLowerCase().includes(q))?.[0] || q;

      return (
        task.name.toLowerCase().includes(q) ||
        task.priority.toLowerCase().includes(prioritySyn) ||
        task.username.toLowerCase().includes(q) ||
        task.recurrence.toLowerCase().includes(recurrenceSyn) ||
        (task.comment ?? '').toLowerCase().includes(q) ||
        String(task.rating).includes(q)
      );
    }

    return true;
  });
}
