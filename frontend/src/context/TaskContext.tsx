import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Task } from '../types';
import { fetchTasks, createTask, fetchSubtasks as fetchSubtasksAPI } from '../api'; // Renamed import

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, parentId?: number) => Promise<void>;
  loadSubtasks: (parentId: number) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  
  const refreshTasks = useCallback(async () => {
    try {
      const topLevelTasks = await fetchTasks();
      setTasks(topLevelTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  }, []);

  const addTask = useCallback(async (title: string, parentId?: number) => {
    try {
      const newTask = await createTask(title, parentId);
      // Original code:
      // fetchTasks().then(setTasks);
      // Not optimal as it fetches all tasks again
      // Instead, we can just add the new task to the existing state
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  }, []);

  // Fetches subtasks for specific parent id & adds them to the state
  const loadSubtasks = useCallback(async (parentId: number) => {
    // Check if subtasks for this parent are already loaded into state
    const alreadyLoaded = tasks.some(task => task.parentId === parentId);
    if (alreadyLoaded) {
      return;
    }

    try {
      console.log(`Fetching subtasks for parent id: ${parentId}...`);
      const fetchedSubtasks = await fetchSubtasksAPI(parentId);
      if (fetchedSubtasks.length > 0) {
        // Add newly fetched subtasks to the state
        setTasks((prevTasks) => {
          return [...prevTasks, ...fetchedSubtasks];
        });
      } else {
        console.log(`No subtasks found for parent ${parentId}.`);
      }
    } catch (error) {
      console.error(`Failed to load subtasks for parent ${parentId}:`, error);
    }
  }, [tasks]);

  return (
    <TaskContext.Provider value={{ tasks, addTask, loadSubtasks, refreshTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
};
