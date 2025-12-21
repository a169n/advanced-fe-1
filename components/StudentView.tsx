"use client";

import { FormEvent, useMemo, useState } from "react";
import { useAnswerBoard } from "../hooks/useAnswerBoard";
import { Language, STUDENTS } from "../types";

const quizPrompt = {
  question: "Summarize how transformer attention helps multilingual models understand context.",
  rubricHints: [
    "Mention self-attention or attention weights",
    "Reference multilingual or cross-lingual context",
    "Highlight how distant tokens stay connected",
  ],
  expectedKeywords: ["attention", "context", "multilingual"],
};

export default function StudentView() {
  const { submitStudentAnswer, state, setActiveStudent } = useAnswerBoard();
  const [language, setLanguage] = useState<Language>("EN");
  const [answer, setAnswer] = useState("");
  const [submittedPreview, setSubmittedPreview] = useState<{
    answer: string;
    language: Language;
  } | null>(null);

  const activeStudent = STUDENTS.find((s) => s.id === state.ui.activeStudentId) ?? STUDENTS[0];

  const recentSubmissions = useMemo(() => {
    return Object.values(state.board.tasksById)
      .filter((task) => task.studentId === activeStudent.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [activeStudent.id, state.board.tasksById]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    submitStudentAnswer({
      questionPrompt: quizPrompt.question,
      studentAnswer: answer,
      language,
    });
    setSubmittedPreview({ answer, language });
    setAnswer("");
  };

  return (
    <section className="student-shell">
      <div className="student-card">
        <div className="student-card__header">
          <div>
            <p className="eyebrow">Quick Quiz</p>
            <h2>{quizPrompt.question}</h2>
          </div>
          <div className="pill">Teacher will review</div>
        </div>
        <div className="student-grid">
          <div className="student-panel">
            <div className="panel-block">
              <p className="eyebrow">Rubric hints</p>
              <ul className="hint-list">
                {quizPrompt.rubricHints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </div>
            <div className="panel-block">
              <p className="eyebrow">Expected keywords</p>
              <div className="chip-row">
                {quizPrompt.expectedKeywords.map((kw) => (
                  <span key={kw} className="chip">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <form onSubmit={submit} className="student-form">
            <label className="stack">
              <span>Active student</span>
              <div className="segmented">
                {STUDENTS.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    className={`segmented__btn ${student.id === activeStudent.id ? "active" : ""}`}
                    onClick={() => setActiveStudent(student.id)}
                  >
                    {student.name}
                  </button>
                ))}
              </div>
            </label>
            <label className="stack">
              <span>Answer language</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
                <option value="EN">English</option>
                <option value="RU">Russian</option>
                <option value="KZ">Kazakh</option>
              </select>
            </label>
            <label className="stack">
              <span>Your answer</span>
              <textarea
                rows={6}
                placeholder="Share your short answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="primary-btn" disabled={!answer.trim()}>
              Submit for review
            </button>
            {submittedPreview && (
              <div className="success-box">
                <p className="eyebrow">Submitted</p>
                <p className="muted">Teacher will review your response soon.</p>
                <p className="muted">Language: {submittedPreview.language}</p>
                <p className="preview">{submittedPreview.answer}</p>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="student-card">
        <div className="student-card__header">
          <p className="eyebrow">Recent submissions</p>
          <span className="muted">Latest three answers for {activeStudent.name}</span>
        </div>
        {recentSubmissions.length === 0 ? (
          <p className="muted">No submissions yet.</p>
        ) : (
          <div className="submission-grid">
            {recentSubmissions.map((task) => (
              <div key={task.id} className="submission-card">
                <div className="chip">{task.language}</div>
                <p className="preview">{task.studentAnswer}</p>
                <div className="muted small">Score preview: {task.simulatedNlpScore}</div>
                <div className="muted small">{new Date(task.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
