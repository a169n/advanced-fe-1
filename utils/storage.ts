import { BoardState } from "../types";

const STORAGE_KEY = "nlp_short_answer_board_state_v1";

export const loadState = (): BoardState | null => {
  if (typeof window === "undefined") return null;
  try {
    const data = window.localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (parsed?.board?.columns && parsed?.board?.tasksById && parsed?.ui?.filters) {
      return parsed as BoardState;
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
