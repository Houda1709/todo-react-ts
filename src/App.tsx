import { useState, useEffect } from "react";
import TodoItem from "./components/TodoItem";
import type { Task, Filter } from "./types";
import "./App.css";

const STORAGE_KEY = "tasks-v2";

const FILTERS = [
  { key: "all", label: "Toutes" },
  { key: "active", label: "En cours" },
  { key: "done", label: "Terminées" },
] as const satisfies readonly { key: Filter; label: string }[];

// Lecture sécurisée : si les données sont corrompues, on repart de zéro
function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Task[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // React 19 : une "action" de formulaire reçoit directement les données
  function addTask(formData: FormData) {
    const text = String(formData.get("text") ?? "").trim();
    if (!text) return;
    setTasks((prev) => [{ id: crypto.randomUUID(), text, done: false }, ...prev]);
  }

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function clearDone() {
    setTasks((prev) => prev.filter((t) => !t.done));
  }

  // Valeurs dérivées : calculées, pas stockées
  const doneCount = tasks.filter((t) => t.done).length;
  const activeCount = tasks.length - doneCount;
  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  const visibleTasks = tasks.filter((t) =>
    filter === "active" ? !t.done : filter === "done" ? t.done : true,
  );

  return (
    <main className="app">
      <header className="header">
        <h1>Ma To-Do List</h1>
        <p>Organise ta journée, une tâche à la fois.</p>
      </header>

      <div className="progress">
        <div className="progress-info">
          <span>Progression</span>
          <span>{percent}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <form className="task-form" action={addTask}>
        <input
          name="text"
          placeholder="Que dois-tu faire aujourd'hui ?"
          maxLength={200}
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      <div className="filters">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            className={filter === key ? "active" : ""}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {visibleTasks.length === 0 ? (
        <div className="empty">
          <span className="emoji">📝</span>
          {tasks.length === 0 ? "Aucune tâche pour le moment" : "Rien à afficher ici"}
        </div>
      ) : (
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <TodoItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
          ))}
        </ul>
      )}

      {tasks.length > 0 && (
        <footer className="footer">
          <span>{activeCount} tâche(s) restante(s)</span>
          {doneCount > 0 && (
            <button className="clear-btn" onClick={clearDone}>
              Supprimer les terminées
            </button>
          )}
        </footer>
      )}
    </main>
  );
}