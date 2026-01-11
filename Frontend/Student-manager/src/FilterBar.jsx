export default function FilterBar({ setFilter }) {
  return (
    <div className="filter-bar">
      <button className="filter-btn" onClick={() => setFilter("all")}>
         All Tasks
      </button>
      <button className="filter-btn" onClick={() => setFilter("pending")}>
         Pending
      </button>
      <button className="filter-btn" onClick={() => setFilter("completed")}>
         Completed
      </button>
    </div>
  );
}
