export type Language = "EN" | "RU" | "KZ";

export interface Task {
  id: string;
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
  | { type: "TOGGLE_ADD_MODAL"; payload: { open: boolean; columnId?: string | null } };
