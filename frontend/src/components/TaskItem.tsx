import React, { useState, useCallback } from "react";
import { Task } from "../types";
import { useTasks } from "../context/TaskContext";

export const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const { tasks: allTasks, addTask, loadSubtasks } = useTasks();
  const [isExpanded, setIsExpanded] = useState(false);
  const [subtasksLoaded, setSubtasksLoaded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isLoadingSubtasks, setIsLoadingSubtasks] = useState(false);

  // Find children from the global tasks list
  const children = allTasks.filter((sub) => sub.parentId === task.id);

  const handleToggleExpand = useCallback(async () => {
    const expanding = !isExpanded;
    setIsExpanded(expanding);

    // Load subtasks only when expanding for the first time
    if (expanding && !subtasksLoaded) {
      setIsLoadingSubtasks(true);
      try {
        await loadSubtasks(task.id);
        setSubtasksLoaded(true);
      } catch (error) {
        console.error(`Error loading subtasks for task ${task.id}:`, error);
        setIsExpanded(false);
      } finally {
        setIsLoadingSubtasks(false);
      }
    }
  }, [isExpanded, subtasksLoaded, loadSubtasks, task.id]);

  const handleAddSubtask = useCallback(async () => {
    if (newSubtaskTitle.trim()) {
      try {
        await addTask(newSubtaskTitle, task.id);
        setNewSubtaskTitle("");
        setIsAddingSubtask(false);

        if (!isExpanded) {
          setIsExpanded(true);
        }

        if (!subtasksLoaded) {
          setSubtasksLoaded(true);
        }
      } catch (error) {
        console.error("Failed to add subtask:", error);
      }
    }
  }, [newSubtaskTitle, task.id, addTask, isExpanded, subtasksLoaded]);

  const canExpand = !subtasksLoaded || children.length > 0;

  return (
    <div
      className={`border border-gray-300 rounded-lg p-3 ${
        task.parentId ? "bg-gray-50 ml-8" : "bg-white ml-0"
      } shadow-sm`}
    >
      <div className="flex items-center justify-between">
        {/* Expand/Collapse Button */}
        <button
          onClick={handleToggleExpand}
          disabled={isLoadingSubtasks}
          className={`mr-2 border-none bg-transparent w-5 h-5 flex items-center justify-center focus:outline-none ${
            canExpand ? "visible" : "invisible"
          } ${isLoadingSubtasks ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
        >
          {isLoadingSubtasks ? 
            <span className="text-gray-400">...</span> : 
            <span className="text-gray-500">{isExpanded ? "▼" : "▶"}</span>
          }
        </button>

        {/* Task Title */}
        <div className="flex-grow font-medium text-gray-700">
          {task.title}
        </div>

        {/* Add Subtask Button */}
        <div>
          <button
            onClick={() => setIsAddingSubtask(!isAddingSubtask)}
            className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            {isAddingSubtask ? "Cancel" : "+ Subtask"}
          </button>
        </div>
      </div>

      {/* Add Subtask Form */}
      {isAddingSubtask && (
        <div className="mt-2 ml-7 flex gap-2">
          <input
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            placeholder="New Subtask Title"
            className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
          <button 
            onClick={handleAddSubtask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors text-sm"
          >
            Add
          </button>
        </div>
      )}

      {/* Render Children Recursively */}
      {isExpanded && children.length > 0 && (
        <div className="mt-2 space-y-2">
          {children.map((child) => (
            <TaskItem key={child.id} task={child} />
          ))}
        </div>
      )}
      
      {/* If no subtasks */}
      {isExpanded &&
        subtasksLoaded &&
        children.length === 0 &&
        !isLoadingSubtasks && (
          <div className="mt-2 ml-7 text-gray-500 text-sm">
            No subtasks.
          </div>
        )}
    </div>
  );
};
