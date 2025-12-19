"use client";

import { FormEvent, useState } from "react";
import { useAnswerBoard } from "../hooks/useAnswerBoard";
import { Language } from "../types";

export default function AddTaskModal() {
  const { state, addTask, closeAddModal } = useAnswerBoard();
  const [form, setForm] = useState({
    studentName: "",
    questionPrompt: "",
    studentAnswer: "",
    language: "EN" as Language,
  });

  if (!state.ui.addTaskModalOpen) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.studentName || !form.questionPrompt || !form.studentAnswer) return;
    addTask(form, state.ui.activeColumnId ?? undefined);
    closeAddModal();
    setForm({ studentName: "", questionPrompt: "", studentAnswer: "", language: "EN" });
  };

  return (
    <div className="modal-backdrop" onClick={closeAddModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Add student answer</h3>
        <form onSubmit={submit} className="form-grid">
          <label>
            Student name
            <input
              value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })}
              required
            />
          </label>
          <label>
            Language
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value as Language })}
            >
              <option value="EN">EN</option>
              <option value="RU">RU</option>
              <option value="KZ">KZ</option>
            </select>
          </label>
          <label>
            Question prompt
            <input
              value={form.questionPrompt}
              onChange={(e) => setForm({ ...form, questionPrompt: e.target.value })}
              required
            />
          </label>
          <label>
            Student answer
            <textarea
              rows={4}
              value={form.studentAnswer}
              onChange={(e) => setForm({ ...form, studentAnswer: e.target.value })}
              required
            />
          </label>
          <div className="form-actions">
            <button type="button" className="card-button" onClick={closeAddModal}>
              Cancel
            </button>
            <button type="submit" className="card-button primary">
              Save
            </button>
          </div>
        </form>
        <p className="subtext">
          Rubric tags, simulated score, confidence, and explanation will be generated automatically.
        </p>
      </div>
    </div>
  );
}
