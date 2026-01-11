import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/tasks";

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      const { data } = await axios.post(API, {
        title,
        description,
        priority,
        dueDate: dueDate || null,
      });
      onAdd(data);
      setTitle("");
      setDescription("");
      setPriority("low");
      setDueDate("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task");
    }
  };

  return (
    <form onSubmit={submitHandler} className="add-task-form">
      {error && <div className="error-message">{error}</div>}
      <input
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Enter task description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
}
