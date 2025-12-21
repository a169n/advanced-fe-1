import { BoardState, STUDENTS } from "../types";

const STORAGE_KEY = "nlp_short_answer_board_state_v1";

export const loadState = (): BoardState | null => {
  if (typeof window === "undefined") return null;
  try {
    const data = window.localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (parsed?.board?.columns && parsed?.board?.tasksById && parsed?.ui?.filters) {
      return migrateState(parsed as BoardState);
    }
  } catch (error) {
    console.error("Failed to load state", error);
  }
  return null;
};

export const saveState = (state: BoardState) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save state", error);
  }
};

const migrateState = (state: BoardState): BoardState => {
  const withRole = state.ui.role ?? "teacher";
  const withStudent = state.ui.activeStudentId ?? "student-1";

  const migratedTasks = Object.fromEntries(
    Object.entries(state.board.tasksById).map(([id, task]) => {
      const studentId = task.studentId ?? inferStudentId(task.studentName);
      return [id, { ...task, studentId }];
    }),
  );

  return {
    ...state,
    board: { ...state.board, tasksById: migratedTasks },
    ui: {
      ...state.ui,
      role: withRole,
      activeStudentId: withStudent,
    },
  };
};

const inferStudentId = (name: string) => {
  const found = STUDENTS.find((s) => s.name.toLowerCase() === name?.toLowerCase());
  return found?.id ?? "student-1";
};
