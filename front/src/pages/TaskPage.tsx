// src/pages/TaskPage.tsx
import React from 'react';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import CreateTaskForm from '../components/TaskList';
import { useTasks } from '../hooks/useTask';

const TaskPage: React.FC = () => {
  const { tasks, loading, error, refetch } = useTasks();

  return (
    <>
      <Header onTaskCreated={refetch} />
      <TaskList />

    </>
  );
};

export default TaskPage;