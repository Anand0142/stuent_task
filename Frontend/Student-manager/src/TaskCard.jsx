import { useState } from "react";
import axios from "axios";

const API = "https://student-task-backend-lutz.onrender.com/api/tasks";

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editPriority, setEditPriority] = useState(task.priority || "low");
  const [editDueDate, setEditDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().slice(0,10) : "");

  const toggleComplete = async () => {
    try {
      const { data } = await axios.put(`${API}/${task._id}`, {
        completed: !task.completed,
      });
      onUpdate(data);
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const saveEdit = async () => {
    try {
      const payload = {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
        dueDate: editDueDate || null,
      };
      const { data } = await axios.put(`${API}/${task._id}`, payload);
      onUpdate(data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    }
  };

  const startEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority || "low");
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0,10) : "");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setError("");
  };

  const deleteTask = async () => {
    try {
      await axios.delete(`${API}/${task._id}`);
      onDelete(task._id);
    } catch (err) {
      setError("Failed to delete task");
    }
  };
  const computeDueStatus = () => {
    if (!task.dueDate) return "";
    try {
      const today = new Date();
      const due = new Date(task.dueDate);
      const diffMs = due.setHours(0,0,0,0) - new Date(today.setHours(0,0,0,0));
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return "overdue";
      if (diffDays <= 3) return "due-soon";
      return "upcoming";
    } catch (e) {
      return "";
    }
  };

  const dueClass = computeDueStatus();

  return (
    <div className={`task-card ${task.completed ? "completed" : ""}`}>
      {error && <div className="error-message">{error}</div>}
      {!isEditing ? (
        <>
          <div className="task-content" onClick={toggleComplete}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={toggleComplete}
              className="task-checkbox"
            />
            <div className="task-info">
              <h3 className="task-title">{task.title}</h3>
              {task.description && <p className="task-desc">{task.description}</p>}
              {task.dueDate && (
                <div className={`due-date ${dueClass}`}>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
              )}
              <span className={`priority ${task.priority}`}>{task.priority}</span>
            </div>
          </div>

          <div className="task-actions">
            <button onClick={startEdit} className="edit-btn">✏️</button>
            <button onClick={deleteTask} className="delete-btn">❌</button>
          </div>
        </>
      ) : (
        <div className="edit-form">
          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
          <input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
          <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="edit-actions">
            <button onClick={saveEdit} className="save-btn">Save</button>
            <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
