"use client";

import Column from "./Column";
import AddTaskModal from "./AddTaskModal";
import { useAnswerBoard } from "../hooks/useAnswerBoard";

export default function App() {
  const { columnsWithTasks, setFilters, state, openAddModal } = useAnswerBoard();
  const { language, minScore } = state.ui.filters;

  return (
    <main className="container">
      <header className="header">
        <div className="header-title">
          NLP Short Answer Scoring Board
          <button className="card-button primary" onClick={() => openAddModal(null)}>
            + Add Task
          </button>
        </div>
        <p className="header-desc">
          Simulated evaluation pipeline for student short answers across multilingual contexts.
          Track preprocessing, automated scoring, and human review with lightweight NLP heuristics.
        </p>
        <div className="filters">
          <div className="filter-control">
            <label>
              Language
              <select value={language} onChange={(e) => setFilters({ language: e.target.value as any })}>
                <option value="all">All</option>
                <option value="EN">English</option>
                <option value="RU">Russian</option>
                <option value="KZ">Kazakh</option>
              </select>
            </label>
          </div>
          <div className="filter-control">
            <label>
              Minimum score: {minScore}
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={minScore}
                onChange={(e) => setFilters({ minScore: Number(e.target.value) })}
              />
            </label>
          </div>
        </div>
      </header>

      <section className="board">
        {columnsWithTasks.map((col) => (
          <Column key={col.id} column={col} />
        ))}
      </section>
      <AddTaskModal />
    </main>
  );
}
