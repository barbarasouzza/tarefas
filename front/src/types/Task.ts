export type Priority = 'high' | 'medium' | 'low';
export type Recurrence = 'daily' | 'weekly' | 'monthly' | 'custom';
export type Status = 'done' | 'pending' | 'not done';

export interface Task {
  id?: number;
  name: string;
  priority: Priority;
  recurrence: Recurrence;
  custom_days: string[];
  status: Status;
  username: string;
  rating?: number | null;  // rating pode ser number, null ou undefined (opcional)
  comment?: string;        // deixar opcional, porque pode não ter comentário
  next_due_date?: string;
  reminder_time?: string;
}
