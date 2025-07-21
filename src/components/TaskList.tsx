import React from "react";
import type { Task } from "../types";

type TaskListProps = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onToggleStatus }) => {
  if (tasks.length === 0) {
    return <div className="text-center text-gray-500">No tasks found.</div>;
  }
  return (
    <ul className="space-y-4 fade-in">
      {tasks.map((task) => (
        <li key={task.id} className="bg-white/90 p-5 rounded-2xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-cyan-100 transition hover:shadow-xl">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <button
                onClick={() => onToggleStatus(task.id)}
                className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${task.status === 'completed' ? 'border-green-400 bg-green-100' : 'border-gray-300 bg-gray-50'} transition`}
                title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
              >
                {task.status === 'completed' ? '✅' : '⬜'}
              </button>
              <span className={`font-bold text-lg ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.title}</span>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
            </div>
            <div className="text-sm text-gray-500 mb-1">Due: <span className="font-medium text-indigo-600">{task.dueDate}</span></div>
            <div className="text-sm text-gray-600">{task.description}</div>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <button onClick={() => onEdit(task)} className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow transition flex items-center gap-1" title="Edit"><span>✏️</span> Edit</button>
            <button onClick={() => onDelete(task.id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition flex items-center gap-1" title="Delete"><span>🗑️</span> Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList; 