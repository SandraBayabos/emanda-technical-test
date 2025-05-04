import React, { useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskItem } from './TaskItem';

export const TaskList: React.FC = () => {
  const { tasks, refreshTasks } = useTasks();
  const topLevelTasks = tasks.filter((task) => !task.parentId);

  useEffect(() => {
    refreshTasks();
  }, []);

  return (
    <div className="space-y-4">
      {topLevelTasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          No top-level tasks found.
        </p>
      ) : (
        topLevelTasks.map((task) => <TaskItem key={task.id} task={task} />)
      )}
    </div>
  );
};