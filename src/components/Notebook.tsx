import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const NOTEBOOK_KEY = "notebook_notes_v2";
const HISTORY_KEY = "notebook_history_v2";

interface NoteLine {
  text: string;
  timestamp: string; // ISO string
}

const getNow = () => new Date().toISOString();

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString();
};

const Notebook: React.FC = () => {
  const [lines, setLines] = useState<NoteLine[]>([{ text: "", timestamp: getNow() }]);
  const [history, setHistory] = useState<NoteLine[][]>([]);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(NOTEBOOK_KEY);
    if (stored) setLines(JSON.parse(stored));
    const hist = localStorage.getItem(HISTORY_KEY);
    if (hist) setHistory(JSON.parse(hist));
  }, []);

  useEffect(() => {
    localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(lines));
  }, [lines]);
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const handleLineChange = (idx: number, value: string) => {
    setHistory((prev) => [...prev, lines]);
    setLines((prev) =>
      prev.map((line, i) =>
        i === idx ? { text: value, timestamp: getNow() } : line
      )
    );
  };

  const handleAddLine = (idx: number) => {
    setLines((prev) => [
      ...prev.slice(0, idx + 1),
      { text: "", timestamp: getNow() },
      ...prev.slice(idx + 1),
    ]);
  };

  const handleRemoveLine = (idx: number) => {
    if (lines.length === 1) return;
    setLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRestore = (idx: number) => {
    setLines(history[idx]);
    setHistory((prev) => prev.slice(0, idx));
  };

  const handleExport = (asMarkdown = true) => {
    const content = lines.map((l) => l.text).join("\n");
    const blob = new Blob([content], { type: asMarkdown ? "text/markdown" : "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = asMarkdown ? "notebook.md" : "notebook.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm("Clear all notes and history?")) {
      setLines([{ text: "", timestamp: getNow() }]);
      setHistory([]);
    }
  };

  return (
    <div className="bg-white/80 rounded-3xl shadow-2xl px-0 py-0 mt-8 border border-indigo-100 fade-in overflow-hidden">
      {/* Sticky, glassy toolbar */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-indigo-100 px-8 py-4 flex items-center justify-between shadow-sm">
        <h2 className="text-2xl font-extrabold text-indigo-700 flex items-center gap-2 tracking-tight drop-shadow-sm">
          <span>📝</span> Notebook
        </h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowMarkdown((v) => !v)} className="px-3 py-1.5 rounded-lg bg-cyan-100 text-cyan-700 font-semibold hover:bg-cyan-200 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300">{showMarkdown ? "Hide" : "Show"} Preview</button>
          <button onClick={() => setShowHistory((v) => !v)} className="px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">History</button>
          <button onClick={() => handleExport(true)} className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300">Export MD</button>
          <button onClick={() => handleExport(false)} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300">Export TXT</button>
          <button onClick={handleClear} className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300">Clear</button>
        </div>
      </div>
      {/* History Panel */}
      {showHistory && (
        <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 max-h-48 overflow-y-auto mx-8 mt-4">
          <div className="font-semibold mb-2 text-gray-700">History</div>
          {history.length === 0 ? (
            <div className="text-gray-400">No history yet.</div>
          ) : (
            <ul className="space-y-1">
              {history.map((h, i) => (
                <li key={i} className="flex items-center gap-2">
                  <button onClick={() => handleRestore(i)} className="text-blue-600 underline text-sm">Restore</button>
                  <span className="text-xs text-gray-500">{h.length} lines</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {/* Editor and Preview */}
      <div className="flex flex-col md:flex-row gap-0">
        {/* Editor */}
        <div className="flex-1 px-8 py-8">
          <div className="space-y-2">
            {lines.map((line, idx) => (
              <div key={idx} className="relative group flex items-center gap-2">
                <textarea
                  className="w-full min-h-[32px] border border-cyan-200 rounded-lg p-2 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition bg-white/90 shadow resize-none"
                  value={line.text}
                  onChange={e => handleLineChange(idx, e.target.value)}
                  onFocus={() => setHoveredLine(idx)}
                  onBlur={() => setHoveredLine(null)}
                  placeholder={`Line ${idx + 1}`}
                />
                <button onClick={() => handleAddLine(idx)} className="text-green-500 hover:text-green-700 text-xl transition" title="Add line">＋</button>
                {lines.length > 1 && (
                  <button onClick={() => handleRemoveLine(idx)} className="text-red-400 hover:text-red-600 text-xl transition" title="Remove line">✕</button>
                )}
                {/* Timestamp Tooltip */}
                <span className={`absolute right-0 -top-7 text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded shadow border border-indigo-100 z-10 transition-opacity duration-200 pointer-events-none ${hoveredLine === idx ? 'opacity-100' : 'opacity-0'}`}>
                  {formatDate(line.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Divider */}
        <div className="hidden md:block w-px bg-gradient-to-b from-indigo-200 via-cyan-200 to-transparent my-8"></div>
        {/* Markdown Preview */}
        {showMarkdown && (
          <div className="flex-1 px-8 py-8 bg-white/80 border-l border-cyan-100 rounded-none md:rounded-r-3xl shadow-inner min-h-[120px] max-h-[600px] overflow-auto">
            <div className="font-semibold text-indigo-700 mb-2">Markdown Preview</div>
            <div className="prose prose-indigo prose-sm max-w-none">
              <ReactMarkdown>{lines.map(l => l.text).join("\n")}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notebook; 