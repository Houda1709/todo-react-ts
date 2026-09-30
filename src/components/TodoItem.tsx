import type { Task } from "../types";

type TodoItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TodoItem({ task, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        aria-label={`Marquer "${task.text}" comme terminée`}
      />
      <span className="todo-text">{task.text}</span>
      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label={`Supprimer "${task.text}"`}
      >
        ✕
      </button>
    </li>
  );
}