import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  const addTask = () => {
    if (!task.trim() || !dueDate) {
      alert("Please enter task and due date.");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: task,
      completed: false,
      dueDate,
    };

    setTasks([...tasks, newTask]);
    setTask("");
    setDueDate("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleStatus = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed }
          : t
      )
    );
  };

  const isOverdue = (task) => {
    return (
      !task.completed &&
      new Date(task.dueDate) < new Date()
    );
  };

  const getRemainingTime = (dueDate) => {
    const diff = new Date(dueDate) - new Date();

    if (diff <= 0) return "⛔ Overdue";

    const days = Math.floor(
      diff / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (diff % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    return `${days}d ${hours}h ${minutes}m left`;
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Completed"
        ? t.completed
        : !t.completed;

    return matchesSearch && matchesFilter;
  });

  return (
    <div
      className={
        darkMode
          ? "container dark"
          : "container"
      }
    >
      <h2>📋 Task Manager</h2>

      <p className="subtitle">
        🚀 Organize your day and never miss a
        deadline.
      </p>

      <div className="theme-toggle">
        <button
          className="theme-btn"
          onClick={() =>
            setDarkMode(!darkMode)
          }
        >
          {darkMode
            ? "☀️ Light Mode"
            : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter task..."
          value={task}
          onChange={(e) =>
            setTask(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter")
              addTask();
          }}
        />

        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
        />

        <button
          className="add-btn"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      <div className="search-filter">
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <h3>No Tasks Yet</h3>
          <p>
            Add your first task above.
          </p>
        </div>
      ) : (        filteredTasks.map((t) => (
          <div
            key={t.id}
            className="task-card"
            style={{
              borderLeft: isOverdue(t)
                ? "6px solid #ff3b30"
                : t.completed
                ? "6px solid #28a745"
                : "6px solid #4f8cff",
            }}
          >
            <div className="task-info">
              <h3 className={t.completed ? "completed" : ""}>
                {t.title}
              </h3>

              <p>
                📅{" "}
                {new Date(t.dueDate).toLocaleString()}
              </p>

              <p>
                ⏰{" "}
                {getRemainingTime(t.dueDate)}
              </p>

              <span
                className={
                  t.completed
                    ? "status done"
                    : "status pending"
                }
              >
                {t.completed
                  ? "✅ Completed"
                  : "🕒 Pending"}
              </span>
            </div>

            <div className="actions">
              <button
                className="complete-btn"
                onClick={() =>
                  toggleStatus(t.id)
                }
              >
                {t.completed
                  ? "Undo"
                  : "Done"}
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteTask(t.id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;