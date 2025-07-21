import React from "react";

type TaskControlsProps = {
  filter: 'all' | 'pending' | 'completed';
  setFilter: (filter: 'all' | 'pending' | 'completed') => void;
  sortBy: 'dueDate' | 'priority';
  setSortBy: (sort: 'dueDate' | 'priority') => void;
};

const TaskControls: React.FC<TaskControlsProps> = ({ filter, setFilter, sortBy, setSortBy }) => {
  return (
    <div className="flex flex-col md:flex-row gap-2 mb-6 items-center justify-between bg-white/70 rounded-xl shadow p-4 border border-indigo-100 backdrop-blur-sm">
      <div className="flex gap-2">
        <button
          className={`px-4 py-1.5 rounded-lg font-semibold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${filter === 'all' ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-1.5 rounded-lg font-semibold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${filter === 'pending' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`px-4 py-1.5 rounded-lg font-semibold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${filter === 'completed' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>
      <div className="flex gap-2 items-center">
        <label className="font-semibold text-indigo-700">Sort by:</label>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as 'dueDate' | 'priority')}
          className="border border-indigo-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition bg-white text-gray-700 font-semibold shadow-sm"
        >
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>
  );
};

export default TaskControls; 