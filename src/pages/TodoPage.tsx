import React, { useState, useEffect } from "react";
import type { Task } from "../types";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskControls from "../components/TaskControls";
import { v4 as uuidv4 } from "uuid";

const getSortedTasks = (tasks: Task[], sortBy: 'dueDate' | 'priority') => {
  if (sortBy === 'dueDate') {
    return [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  } else {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }
};

const TodoPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (taskData: Omit<Task, "id">) => {
    setTasks(prev => [...prev, { ...taskData, id: uuidv4() }]);
    setShowForm(false);
  };

  const handleEditTask = (taskData: Omit<Task, "id">) => {
    if (!editingTask) return;
    setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
    setEditingTask(null);
    setShowForm(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t));
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const filteredTasks = tasks.filter(task =>
    filter === 'all' ? true : task.status === filter
  );
  const sortedTasks = getSortedTasks(filteredTasks, sortBy);

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <div className="bg-white/90 rounded-3xl shadow-2xl px-8 py-10 mb-8 border border-indigo-100">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-indigo-700 tracking-tight drop-shadow">To-Do List</h1>
        <TaskControls filter={filter} setFilter={setFilter} sortBy={sortBy} setSortBy={setSortBy} />
        <button
          className="mb-4 px-6 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold rounded-lg shadow hover:from-indigo-600 hover:to-cyan-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onClick={() => { setShowForm(true); setEditingTask(null); }}
        >
          + Add Task
        </button>
        {showForm && (
          <TaskForm
            initialTask={editingTask || undefined}
            onSubmit={editingTask ? handleEditTask : handleAddTask}
            onCancel={() => { setShowForm(false); setEditingTask(null); }}
          />
        )}
        <TaskList
          tasks={sortedTasks}
          onEdit={handleEditClick}
          onDelete={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </div>
  );
};

export default TodoPage; 