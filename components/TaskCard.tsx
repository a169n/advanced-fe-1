"use client";

import { useState } from "react";
import { useAnswerBoard } from "../hooks/useAnswerBoard";
import { Task } from "../types";

interface TaskCardProps {
  task: Task;
  columnId: string;
}

export default function TaskCard({ task, columnId }: TaskCardProps) {
  const { deleteTask, moveTaskLeft, moveTaskRight, moveTaskToColumn, rescoreTask, state } =
    useAnswerBoard();
  const [expanded, setExpanded] = useState(false);

  const otherColumns = state.board.columns.filter((c) => c.id !== columnId);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <strong>{task.studentName}</strong>
          <div className="subtext">{task.questionPrompt}</div>
        </div>
        <span className="language-chip">{task.language}</span>
      </div>
      <div>
        <div className={expanded ? "" : "truncate"}>{task.studentAnswer}</div>
        <button className="card-button secondary" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Show less" : "Show more"}
        </button>
      </div>
      <div className="badges">
        {task.rubricCriteria.map((crit) => (
          <span key={crit} className="badge">
            {crit}
          </span>
        ))}
      </div>
      <div className="meta">
        <span className="badge tag-green">Score {task.simulatedNlpScore}</span>
        <span className="badge tag-orange">Confidence {task.confidence}</span>
        <span className="subtext">{task.statusReason}</span>
      </div>
      <div className="card-footer">
        <div className="card-actions">
          <button className="card-button" onClick={() => moveTaskLeft(task.id)}>
            ◀ Move left
          </button>
          <button className="card-button" onClick={() => moveTaskRight(task.id)}>
            Move right ▶
          </button>
          <select
            className="card-button"
            aria-label="Move to column"
            onChange={(e) => moveTaskToColumn(task.id, e.target.value)}
            value={columnId}
          >
            <option value={columnId}>Stay</option>
            {otherColumns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div className="card-actions">
          <button className="card-button secondary" onClick={() => rescoreTask(task.id)}>
            Re-score
          </button>
          <button className="card-button danger" onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      </div>
      <div className="subtext">Created {new Date(task.createdAt).toLocaleString()}</div>
    </div>
  );
}
