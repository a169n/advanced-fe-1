import { BoardState, Language, Task } from "../types";

const rubricOptions = ["Key concepts", "Clarity", "Terminology", "Reasoning", "Cohesion"];

const languageStopwords: Record<Language, string[]> = {
  EN: ["the", "and", "is", "in", "of", "to"],
  RU: ["и", "в", "на", "это", "как", "что"],
  KZ: ["және", "мен", "үшін", "де", "ма", "ба"],
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const pickRubric = () => rubricOptions.sort(() => 0.5 - Math.random()).slice(0, 3);

const keywordCandidates = (prompt: string) => {
  return prompt
    .toLowerCase()
    .replace(/[^a-zA-Zа-яА-ЯёЁңғүұқөһїі\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 3)
    .slice(0, 4);
};

const scoreAnswer = (answer: string, prompt: string, language: Language) => {
  const keywords = keywordCandidates(prompt);
  const normalized = answer.toLowerCase();
  const matches = keywords.filter((kw) => normalized.includes(kw)).length;
  const stopwords = languageStopwords[language];
  const tokens = normalized.split(/\s+/).filter((t) => t && !stopwords.includes(t));
  const lengthScore = clamp(tokens.length / 6, 0, 4);
  const keywordScore = matches * 2.5;
  const rawScore = clamp(lengthScore + keywordScore, 0, 10);
  const confidence = clamp(0.4 + (matches / Math.max(1, keywords.length)) * 0.45, 0.4, 0.95);
  let statusReason = "";
  if (matches === 0) {
    statusReason = "No rubric keywords detected";
  } else if (rawScore < 4) {
    statusReason = "Too short or off-topic";
  } else if (confidence < 0.6) {
    statusReason = "Low confidence: paraphrase mismatch";
  } else {
    statusReason = `Matched ${matches}/${Math.max(1, keywords.length)} rubric keywords`;
  }

  return {
    score: parseFloat(rawScore.toFixed(1)),
    confidence: parseFloat(confidence.toFixed(2)),
    explanation: statusReason,
  };
};

const baseQuestions = [
  {
    prompt: "Explain how transformers handle long-range dependencies in text",
    language: "EN" as Language,
    answer:
      "Transformers use self-attention to weigh distant tokens, letting the model capture long-range dependencies without recurrence.",
  },
  {
    prompt: "Опишите роль стемминга и лемматизации в предобработке текста",
    language: "RU" as Language,
    answer: "Лемматизация приводит слова к нормальной форме, стемминг обрезает окончания, оба шага улучшают поиск ключевых слов.",
  },
  {
    prompt: "NLP-де сөз векторлары қалай құрылады?",
    language: "KZ" as Language,
    answer: "Сөз векторлары үлкен корпусқа негізделген, контексттік кооккуренциялар арқылы модель үйренеді.",
  },
  {
    prompt: "Define tokenization and why it matters for multilingual NLP",
    language: "EN" as Language,
    answer: "Tokenization splits text into units; for multilingual NLP it needs to respect scripts, subwords, and handle clitics.",
  },
  {
    prompt: "Как нейронные сети вычисляют вероятности слов?",
    language: "RU" as Language,
    answer: "Через softmax над логитами выходного слоя, нормируя вероятности для каждого слова словаря.",
  },
  {
    prompt: "What is transfer learning in NLP?",
    language: "EN" as Language,
    answer: "It reuses pretrained language models and fine-tunes on a target dataset to adapt representations.",
  },
  {
    prompt: "Семантикалық ұқсастықты бағалау үшін қандай әдістер қолданылады?",
    language: "KZ" as Language,
    answer: "Косинустық ұқсастық және биэнкодер эмбеддингтері жиі қолданылады, қосымша cross-encoder тәсілдері бар.",
  },
  {
    prompt: "Why do we evaluate perplexity in language models?",
    language: "EN" as Language,
    answer: "Perplexity measures how well a model predicts a test set; lower values indicate better predictive power.",
  },
];

const columnsSeed = [
  { id: "submitted", title: "Submitted" },
  { id: "preprocessed", title: "Preprocessed" },
  { id: "auto_scored", title: "Auto-Scored" },
  { id: "needs_review", title: "Needs Review" },
  { id: "finalized", title: "Finalized" },
];

export const createTaskFromInput = (
  input: Pick<Task, "studentName" | "questionPrompt" | "studentAnswer" | "language">,
): Task => {
  const rubricCriteria = pickRubric();
  const { score, confidence, explanation } = scoreAnswer(input.studentAnswer, input.questionPrompt, input.language);
  return {
    ...input,
    rubricCriteria,
    simulatedNlpScore: score,
    confidence,
    statusReason: explanation,
    id: `task-${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
  };
};

export const initialBoardState = (): BoardState => {
  const tasksById: Record<string, Task> = {};
  const columns = columnsSeed.map((c) => ({ ...c, taskIds: [] as string[] }));

  baseQuestions.forEach((sample, index) => {
    const task = createTaskFromInput({
      studentName: `Student ${index + 1}`,
      questionPrompt: sample.prompt,
      studentAnswer: sample.answer,
      language: sample.language,
    });
    tasksById[task.id] = task;
    const columnIndex = index % columns.length;
    columns[columnIndex].taskIds.push(task.id);
  });

  return {
    board: {
      id: "board-1",
      title: "NLP Short Answer Scoring Board",
      columns,
      tasksById,
    },
    ui: {
      addTaskModalOpen: false,
      activeColumnId: null,
      filters: { language: "all", minScore: 0 },
    },
  };
};
