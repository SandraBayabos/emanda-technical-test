import React, { useState } from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import { TaskList } from './components/TaskList';

const Main = () => {
  const [title, setTitle] = useState('');
  const { addTask } = useTasks();

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Task Manager</h1>
      <div className="flex gap-2 mb-6">
        <input 
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="New Task" 
        />
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          onClick={() => { addTask(title); setTitle(''); }}
        >
          Add Task
        </button>
      </div>
      <TaskList />
    </div>
  );
};

const App = () => (
  <TaskProvider>
    <div className="min-h-screen bg-gray-50">
      <Main />
    </div>
  </TaskProvider>
);

export default App;
