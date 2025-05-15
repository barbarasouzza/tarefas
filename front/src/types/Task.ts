export type Priority = 'high' | 'medium' | 'low';
export type Recurrence = 'daily' | 'weekly' | 'monthly' | 'custom';
export type Status = 'done' | 'pending' | 'not done';

export interface Task {
  id?: number;
  name: string;
  priority: 'high' | 'medium' | 'low';
  recurrence: 'daily' | 'weekly' | 'monthly' | 'custom';
  custom_days: string[];
  status: 'done' | 'pending' | 'not done';
  username: string;
  rating: number;
  comment: string;
  next_due_date: string;
  reminder_time: string;
}

