"use client";

import React, { createContext, useEffect, useMemo, useReducer } from "react";
import { BoardAction, BoardState } from "../types";
import { initialBoardState } from "../utils/mock";
import { loadState, saveState } from "../utils/storage";

interface BoardContextValue {
  state: BoardState;
  dispatch: React.Dispatch<BoardAction>;
}

export const BoardContext = createContext<BoardContextValue | undefined>(undefined);

const reducer = (state: BoardState, action: BoardAction): BoardState => {
  switch (action.type) {
    case "INIT_FROM_STORAGE": {
      return action.payload;
    }
    case "ADD_TASK": {
      const { columnId, task } = action.payload;
      return {
        ...state,
        board: {
          ...state.board,
          tasksById: { ...state.board.tasksById, [task.id]: task },
          columns: state.board.columns.map((col) =>
            col.id === columnId ? { ...col, taskIds: [task.id, ...col.taskIds] } : col,
          ),
        },
      };
    }
    case "DELETE_TASK": {
      const { taskId } = action.payload;
      const { [taskId]: _, ...rest } = state.board.tasksById;
      return {
        ...state,
        board: {
          ...state.board,
          tasksById: rest,
          columns: state.board.columns.map((col) => ({
            ...col,
            taskIds: col.taskIds.filter((id) => id !== taskId),
          })),
        },
      };
    }
    case "MOVE_TASK": {
      const { fromColumnId, taskId, toColumnId, toIndex } = action.payload;
      if (fromColumnId === toColumnId) return state;
      return {
        ...state,
        board: {
          ...state.board,
          columns: state.board.columns.map((col) => {
            if (col.id === fromColumnId) {
              return { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) };
            }
            if (col.id === toColumnId) {
              const nextIds = col.taskIds.filter((id) => id !== taskId);
              if (typeof toIndex === "number") {
                nextIds.splice(toIndex, 0, taskId);
              } else {
                nextIds.unshift(taskId);
              }
              return { ...col, taskIds: nextIds };
            }
            return col;
          }),
        },
      };
    }
    case "UPDATE_TASK": {
      const { taskId, patch } = action.payload;
      const current = state.board.tasksById[taskId];
      if (!current) return state;
      return {
        ...state,
        board: {
          ...state.board,
          tasksById: {
            ...state.board.tasksById,
            [taskId]: { ...current, ...patch },
          },
        },
      };
    }
    case "SET_FILTERS": {
      return {
        ...state,
        ui: {
          ...state.ui,
          filters: { ...state.ui.filters, ...action.payload.patch },
        },
      };
    }
    case "SET_ROLE": {
      return {
        ...state,
        ui: { ...state.ui, role: action.payload.role },
      };
    }
    case "SET_ACTIVE_STUDENT": {
      return {
        ...state,
        ui: { ...state.ui, activeStudentId: action.payload.studentId },
      };
    }
    case "TOGGLE_ADD_MODAL": {
      return {
        ...state,
        ui: {
          ...state.ui,
          addTaskModalOpen: action.payload.open,
          activeColumnId: action.payload.columnId ?? state.ui.activeColumnId,
        },
      };
    }
    default:
      return state;
  }
};

export const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialBoardState());

  useEffect(() => {
    const stored = loadState();
    if (stored) {
      dispatch({ type: "INIT_FROM_STORAGE", payload: stored });
    }
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};
