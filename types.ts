export type Language = "EN" | "RU" | "KZ";

export type Student = { id: "student-1" | "student-2"; name: string };

export const STUDENTS: Student[] = [
  { id: "student-1", name: "Aruzhan" },
  { id: "student-2", name: "Daniyar" },
];

export interface Task {
  id: string;
  studentId: Student["id"];
  studentName: string;
  questionPrompt: string;
  studentAnswer: string;
  language: Language;
  rubricCriteria: string[];
  simulatedNlpScore: number;
  confidence: number;
  statusReason: string;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface FiltersState {
  language: "all" | Language;
  minScore: number;
}

export interface BoardState {
  board: {
    id: string;
    title: string;
    columns: Column[];
    tasksById: Record<string, Task>;
  };
  ui: {
    addTaskModalOpen: boolean;
    activeColumnId: string | null;
    filters: FiltersState;
    role: "teacher" | "student";
    activeStudentId: Student["id"];
  };
}

export type BoardAction =
  | { type: "INIT_FROM_STORAGE"; payload: BoardState }
  | { type: "ADD_TASK"; payload: { columnId: string; task: Task } }
  | { type: "DELETE_TASK"; payload: { taskId: string } }
  | {
      type: "MOVE_TASK";
      payload: { taskId: string; fromColumnId: string; toColumnId: string; toIndex?: number };
    }
  | { type: "UPDATE_TASK"; payload: { taskId: string; patch: Partial<Task> } }
  | { type: "SET_FILTERS"; payload: { patch: Partial<FiltersState> } }
  | { type: "TOGGLE_ADD_MODAL"; payload: { open: boolean; columnId?: string | null } }
  | { type: "SET_ROLE"; payload: { role: "teacher" | "student" } }
  | { type: "SET_ACTIVE_STUDENT"; payload: { studentId: Student["id"] } };
