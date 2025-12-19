"use client";

import { useContext, useMemo } from "react";
import { BoardContext } from "../context/BoardContext";
import { BoardState, Language, Task } from "../types";
import { createTaskFromInput } from "../utils/mock";

const getColumnOrder = (state: BoardState) => state.board.columns.map((c) => c.id);

export const useAnswerBoard = () => {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useAnswerBoard must be used within BoardProvider");
  const { state, dispatch } = ctx;

  const columnsWithTasks = useMemo(() => {
    const { language, minScore } = state.ui.filters;
    return state.board.columns.map((col) => {
      const tasks = col.taskIds
        .map((id) => state.board.tasksById[id])
        .filter(Boolean)
        .filter((task) => {
          const languageOk = language === "all" ? true : task.language === language;
          const scoreOk = task.simulatedNlpScore >= minScore;
          return languageOk && scoreOk;
        });
      return { ...col, tasks };
    });
  }, [state.board.columns, state.board.tasksById, state.ui.filters]);

  const addTask = (
    input: Pick<Task, "studentName" | "questionPrompt" | "studentAnswer" | "language">,
    columnId?: string,
  ) => {
    const targetColumn = columnId ?? state.board.columns[0]?.id ?? "submitted";
    const task = createTaskFromInput(input);
    dispatch({ type: "ADD_TASK", payload: { columnId: targetColumn, task } });
  };

  const deleteTask = (taskId: string) => dispatch({ type: "DELETE_TASK", payload: { taskId } });

  const moveTaskToColumn = (taskId: string, toColumnId: string) => {
    const fromColumn = state.board.columns.find((col) => col.taskIds.includes(taskId));
    if (!fromColumn || fromColumn.id === toColumnId) return;
    dispatch({
      type: "MOVE_TASK",
      payload: { taskId, fromColumnId: fromColumn.id, toColumnId },
    });
  };

  const moveTaskLeft = (taskId: string) => {
    const order = getColumnOrder(state);
    const fromColumn = state.board.columns.find((col) => col.taskIds.includes(taskId));
    if (!fromColumn) return;
    const idx = order.indexOf(fromColumn.id);
    if (idx > 0) {
      moveTaskToColumn(taskId, order[idx - 1]);
    }
  };

  const moveTaskRight = (taskId: string) => {
    const order = getColumnOrder(state);
    const fromColumn = state.board.columns.find((col) => col.taskIds.includes(taskId));
    if (!fromColumn) return;
    const idx = order.indexOf(fromColumn.id);
    if (idx < order.length - 1) {
      moveTaskToColumn(taskId, order[idx + 1]);
    }
  };

  const rescoreTask = (taskId: string) => {
    const task = state.board.tasksById[taskId];
    if (!task) return;
    const regenerated = createTaskFromInput({
      studentName: task.studentName,
      questionPrompt: task.questionPrompt,
      studentAnswer: task.studentAnswer,
      language: task.language,
    });
    dispatch({ type: "UPDATE_TASK", payload: { taskId, patch: regenerated } });
  };

  const setFilters = (patch: Partial<{ language: Language | "all"; minScore: number }>) => {
    dispatch({ type: "SET_FILTERS", payload: { patch } });
  };

  const openAddModal = (columnId?: string | null) =>
    dispatch({ type: "TOGGLE_ADD_MODAL", payload: { open: true, columnId: columnId ?? null } });

  const closeAddModal = () =>
    dispatch({ type: "TOGGLE_ADD_MODAL", payload: { open: false, columnId: null } });

  return {
    state,
    columnsWithTasks,
    addTask,
    deleteTask,
    moveTaskLeft,
    moveTaskRight,
    moveTaskToColumn,
    rescoreTask,
    setFilters,
    openAddModal,
    closeAddModal,
  };
};
