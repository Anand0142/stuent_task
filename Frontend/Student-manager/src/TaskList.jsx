import TaskCard from "./TaskCard";

export default function TaskList({ tasks, onUpdate, onDelete }) {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard
          key={task._id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
