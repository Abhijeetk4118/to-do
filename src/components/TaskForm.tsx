import React, { useState, useEffect } from "react";
import type { Task } from "../types";

type TaskFormProps = {
  initialTask?: Task;
  onSubmit: (task: Omit<Task, 'id'>) => void;
  onCancel?: () => void;
};

const defaultTask = {
  title: '',
  description: '',
  dueDate: '',
  status: 'pending' as const,
  priority: 'medium' as const,
};

const TaskForm: React.FC<TaskFormProps> = ({ initialTask, onSubmit, onCancel }) => {
  const [task, setTask] = useState<Omit<Task, 'id'>>(initialTask ? { ...initialTask } : defaultTask);

  useEffect(() => {
    if (initialTask) setTask({ ...initialTask });
  }, [initialTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/95 p-6 rounded-2xl shadow-lg space-y-5 w-full max-w-lg mx-auto border border-cyan-100 fade-in">
      <div>
        <label className="block font-semibold mb-1 text-indigo-700">Title</label>
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-indigo-700">Description</label>
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-indigo-700">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
          className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          required
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1 text-indigo-700">Priority</label>
          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1 text-indigo-700">Status</label>
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition">Cancel</button>
        )}
        <button type="submit" className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold rounded-lg shadow hover:from-indigo-600 hover:to-cyan-600 transition-colors duration-200">
          {initialTask ? 'Update' : 'Add'} Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm; 