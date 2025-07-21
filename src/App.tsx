import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import TodoPage from "./pages/TodoPage";
import NotebookPage from "./pages/NotebookPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-teal-50 to-cyan-100 p-4">
        <div className="max-w-4xl mx-auto">
          <nav className="bg-white/90 rounded-3xl shadow-lg px-8 py-4 mb-8 border border-indigo-100">
            <ul className="flex justify-center space-x-8">
              <li>
                <Link to="/todo" className="text-lg font-semibold text-indigo-700 hover:text-cyan-500 transition-colors">
                  To-Do
                </Link>
              </li>
              <li>
                <Link to="/notebook" className="text-lg font-semibold text-indigo-700 hover:text-cyan-500 transition-colors">
                  Notebook
                </Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Navigate to="/todo" />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/notebook" element={<NotebookPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
