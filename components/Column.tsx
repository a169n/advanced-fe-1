"use client";

import { useAnswerBoard } from "../hooks/useAnswerBoard";
import { Column as ColumnType, Task } from "../types";
import TaskCard from "./TaskCard";

interface ColumnProps {
  column: ColumnType & { tasks: Task[] };
}

export default function Column({ column }: ColumnProps) {
  const { openAddModal } = useAnswerBoard();

  return (
    <div className="column">
      <div className="column-header">
        <div className="column-title">{column.title}</div>
        <span className="count-badge">{column.tasks.length}</span>
      </div>
      <div style={{ flex: 1 }}>
        {column.tasks.length === 0 && <div className="empty">No tasks in this stage</div>}
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} columnId={column.id} />
        ))}
      </div>
      <button className="card-button" onClick={() => openAddModal(column.id)}>
        + Add here
      </button>
    </div>
  );
}
