"use client";

import Column from "./Column";
import AddTaskModal from "./AddTaskModal";
import StudentView from "./StudentView";
import { useAnswerBoard } from "../hooks/useAnswerBoard";

export default function App() {
  const { columnsWithTasks, setFilters, state, openAddModal, setRole } = useAnswerBoard();
  const { language, minScore } = state.ui.filters;
  const isTeacher = state.ui.role === "teacher";

  return (
    <main className="container">
      <header className="navbar">
        <div>
          <p className="eyebrow">NLP short answers</p>
          <h1>Assessment workspace</h1>
          <p className="header-desc">
            Track multilingual quiz submissions through the scoring pipeline or submit a new answer as a student.
          </p>
        </div>
        <div className="role-toggle" aria-label="Select role">
          <button
            className={`pill-button ${isTeacher ? "active" : ""}`}
            onClick={() => setRole("teacher")}
            type="button"
          >
            Teacher
          </button>
          <button
            className={`pill-button ${!isTeacher ? "active" : ""}`}
            onClick={() => setRole("student")}
            type="button"
          >
            Student
          </button>
        </div>
      </header>

      {isTeacher ? (
        <>
          <div className="toolbar">
            <div className="toolbar-left">
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
            <button className="primary-btn" onClick={() => openAddModal(null)}>
              + Add Task
            </button>
          </div>
          <section className="board">
            {columnsWithTasks.map((col) => (
              <Column key={col.id} column={col} />
            ))}
          </section>
          <AddTaskModal />
        </>
      ) : (
        <StudentView />
      )}
    </main>
  );
}
