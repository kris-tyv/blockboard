"use client";

import { useEffect, useMemo, useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types/task";

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design landing page",
    description: "Create a clean and responsive BlockBoard interface",
    status: "todo",
    priority: "high",
    dueDate: "2025-09-01",
    createdAt: new Date().toISOString(),
  },
];

const columns: { title: string; status: TaskStatus }[] = [
  { title: "To Do", status: "todo" },
  { title: "In Progress", status: "inprogress" },
  { title: "Done", status: "done" },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | TaskPriority>("all");

  useEffect(() => {
    const savedTasks = localStorage.getItem("blockboard-tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(initialTasks);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("blockboard-tasks", JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setStatus("todo");
    setEditingTaskId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId
            ? { ...task, title, description, priority, dueDate, status }
            : task
        )
      );
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        description,
        status,
        priority,
        dueDate,
        createdAt: new Date().toISOString(),
      };

      setTasks((prev) => [newTask, ...prev]);
    }

    resetForm();
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));

    if (editingTaskId === id) {
      resetForm();
    }
  };

  const handleEditTask = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setStatus(task.status);
    setEditingTaskId(task.id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const moveTask = (id: string, direction: "left" | "right") => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const order: TaskStatus[] = ["todo", "inprogress", "done"];
        const index = order.indexOf(task.status);

        if (direction === "left" && index > 0) {
          return { ...task, status: order[index - 1] };
        }

        if (direction === "right" && index < order.length - 1) {
          return { ...task, status: order[index + 1] };
        }

        return task;
      })
    );
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status === "done") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);

    return due < today;
  };

  const isDueToday = (task: Task) => {
    if (!task.dueDate || task.status === "done") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);

    return due.getTime() === today.getTime();
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchSearch && matchPriority;
    });
  }, [tasks, searchTerm, priorityFilter]);

  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const progress = tasks.filter((t) => t.status === "inprogress").length;
  const done = tasks.filter((t) => t.status === "done").length;

  const getPriorityClasses = (taskPriority: TaskPriority) => {
    switch (taskPriority) {
      case "high":
        return "border border-red-400/30 bg-red-500/12 text-red-200";
      case "medium":
        return "border border-yellow-300/30 bg-yellow-400/12 text-yellow-100";
      case "low":
        return "border border-green-400/30 bg-green-500/12 text-green-200";
      default:
        return "border border-white/10 bg-white/10 text-white/70";
    }
  };

  const getColumnTheme = (columnStatus: TaskStatus) => {
    switch (columnStatus) {
      case "todo":
        return {
          border: "border-blue-400/30",
          bg: "bg-blue-500/6",
          badge: "border border-blue-400/30 bg-blue-500/15 text-blue-200",
          title: "text-blue-200",
          glow: "hover:shadow-[0_10px_40px_rgba(59,130,246,0.08)]",
        };
      case "inprogress":
        return {
          border: "border-yellow-300/25",
          bg: "bg-yellow-400/5",
          badge: "border border-yellow-300/30 bg-yellow-400/12 text-yellow-100",
          title: "text-yellow-100",
          glow: "hover:shadow-[0_10px_40px_rgba(250,204,21,0.07)]",
        };
      case "done":
        return {
          border: "border-green-400/25",
          bg: "bg-green-500/5",
          badge: "border border-green-400/30 bg-green-500/12 text-green-200",
          title: "text-green-200",
          glow: "hover:shadow-[0_10px_40px_rgba(34,197,94,0.07)]",
        };
    }
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#08112B] text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08112B] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0E1A42] p-6 shadow-2xl">
          <div className="mb-5 h-[2px] w-full rounded-full bg-gradient-to-r from-blue-500 via-yellow-300 via-green-500 to-red-500 opacity-80" />

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/blocklabs-logo.png"
                alt="Blocklabs logo"
                className="h-14 w-14 object-contain sm:h-16 sm:w-16"
              />

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                BlockBoard
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                label="Total"
                value={total}
                className="border-white/10 bg-white/5"
                labelClassName="text-white/55"
              />
              <StatCard
                label="To Do"
                value={todo}
                className="border-blue-400/20 bg-blue-500/10"
                labelClassName="text-blue-200"
              />
              <StatCard
                label="In Progress"
                value={progress}
                className="border-yellow-300/20 bg-yellow-400/10"
                labelClassName="text-yellow-100"
              />
              <StatCard
                label="Done"
                value={done}
                className="border-green-400/20 bg-green-500/10"
                labelClassName="text-green-200"
              />
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-7 rounded-3xl border border-white/10 bg-[#0E1A42] p-6 shadow-xl"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {editingTaskId ? "Edit Task" : "Create New Task"}
            </h2>

            {editingTaskId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/15"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-2xl border border-blue-400/20 bg-[#111D49] px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-blue-400"
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-2xl border border-green-400/20 bg-[#111D49] px-4 py-3 text-white outline-none transition focus:border-green-400"
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="rounded-2xl border border-yellow-300/20 bg-[#111D49] px-4 py-3 text-white outline-none transition focus:border-yellow-300"
            >
              <option value="low" className="text-black">
                Low Priority
              </option>
              <option value="medium" className="text-black">
                Medium Priority
              </option>
              <option value="high" className="text-black">
                High Priority
              </option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="rounded-2xl border border-blue-400/20 bg-[#111D49] px-4 py-3 text-white outline-none transition focus:border-blue-400"
            >
              <option value="todo" className="text-black">
                To Do
              </option>
              <option value="inprogress" className="text-black">
                In Progress
              </option>
              <option value="done" className="text-black">
                Done
              </option>
            </select>
          </div>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-4 w-full rounded-2xl border border-red-400/20 bg-[#111D49] px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-red-400"
          />

          <button
            type="submit"
            className="mt-4 rounded-2xl bg-gradient-to-r from-blue-500 via-yellow-300 to-green-500 px-5 py-3 font-semibold text-[#08112B] shadow-lg transition hover:scale-[1.01]"
          >
            {editingTaskId ? "Update Task" : "Add Task"}
          </button>
        </form>

        <div className="mb-7 rounded-3xl border border-white/10 bg-[#0E1A42] p-5 shadow-xl">
          <h2 className="mb-4 text-xl font-semibold text-white">Search & Filter</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              placeholder="Search by title or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-2xl border border-blue-400/20 bg-[#111D49] px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-blue-400"
            />

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as "all" | TaskPriority)
              }
              className="rounded-2xl border border-yellow-300/20 bg-[#111D49] px-4 py-3 text-white outline-none transition focus:border-yellow-300"
            >
              <option value="all" className="text-black">
                All Priorities
              </option>
              <option value="low" className="text-black">
                Low Priority
              </option>
              <option value="medium" className="text-black">
                Medium Priority
              </option>
              <option value="high" className="text-black">
                High Priority
              </option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter((task) => task.status === col.status);
            const theme = getColumnTheme(col.status);

            return (
              <section
                key={col.status}
                className={`rounded-3xl border ${theme.border} ${theme.bg} p-5 shadow-xl transition duration-200 ${theme.glow} self-start`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <h2 className={`text-lg font-semibold ${theme.title}`}>{col.title}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${theme.badge}`}>
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {columnTasks.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/15 bg-[#111D49]/55 p-4 text-sm text-white/45">
                      No tasks in this stage yet.
                    </div>
                  )}

                  {columnTasks.map((task) => (
                    <article
                      key={task.id}
                      className={`rounded-2xl border p-4 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl ${
                        isOverdue(task)
                          ? "border-red-400/30 bg-red-500/10"
                          : "border-white/10 bg-[#111D49]"
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="text-base font-semibold text-white">{task.title}</h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityClasses(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <p className="mb-4 text-sm leading-6 text-white/70">
                        {task.description || "No description"}
                      </p>

                      <div className="mb-5 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/60">
                          Due: {task.dueDate || "N/A"}
                        </span>

                        {isDueToday(task) && (
                          <span className="rounded-full border border-yellow-300/30 bg-yellow-400/15 px-2.5 py-1 font-medium text-yellow-100">
                            Due Today
                          </span>
                        )}

                        {isOverdue(task) && (
                          <span className="rounded-full border border-red-400/30 bg-red-500/15 px-2.5 py-1 font-medium text-red-200">
                            Overdue
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => moveTask(task.id, "left")}
                          disabled={task.status === "todo"}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          ← Back
                        </button>

                        <button
                          type="button"
                          onClick={() => moveTask(task.id, "right")}
                          disabled={task.status === "done"}
                          className="rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          Next →
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditTask(task)}
                          className="rounded-xl border border-yellow-300/35 bg-yellow-400/15 px-3 py-2 text-sm font-medium text-yellow-100 transition hover:bg-yellow-400/22"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          className="rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  className,
  labelClassName,
}: {
  label: string;
  value: number;
  className: string;
  labelClassName: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${className}`}>
      <p className={`text-xs ${labelClassName}`}>{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}