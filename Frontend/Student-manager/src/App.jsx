import { useEffect, useState } from "react";
import axios from "axios";
import AddTaskForm from "./AddTaskForm";
import TaskList from "./TaskList";
import FilterBar from "./FilterBar";
import "./App.css";

const API = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API);
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const addTask = (task) => {
    setTasks([task, ...tasks]);
  };

  const updateTask = (updated) => {
    setTasks(tasks.map(t => t._id === updated._id ? updated : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t._id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>Student Task Manager</h1>
      <AddTaskForm onAdd={addTask} />
      <FilterBar setFilter={setFilter} />
      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="no-tasks">No tasks found</p>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}

export default App;
