'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { clearToken, getToken } from '@/lib/authStorage';

type Priority = 'low' | 'medium' | 'high';
type Status = 'todo' | 'in_progress' | 'done';

interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  status: Status;
  createdAt: string;
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<Status>('todo');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const token = typeof window !== 'undefined' ? getToken() : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, search]);

  async function loadTasks() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);
      const qs = params.toString();
      const path = qs ? `/api/tasks?${qs}` : '/api/tasks';
      const data = await apiRequest<Task[]>(path, { token });
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
      if (err.message === 'Invalid or expired token') {
        clearToken();
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setStatus('todo');
    setEditingId(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) {
      router.push('/login');
      return;
    }
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError(null);

    try {
      const body = {
        title,
        description: description || undefined,
        dueDate: dueDate || undefined,
        priority,
        status,
      };

      if (editingId) {
        await apiRequest<Task>(`/api/tasks/${editingId}`, {
          method: 'PUT',
          body,
          token,
        });
      } else {
        await apiRequest<Task>('/api/tasks', {
          method: 'POST',
          body,
          token,
        });
      }
      resetForm();
      await loadTasks();
    } catch (err: any) {
      setError(err.message || 'Failed to save task');
    }
  }

  async function handleEdit(task: Task) {
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.dueDate ? task.dueDate.substring(0, 10) : '');
    setPriority(task.priority);
    setStatus(task.status);
    setEditingId(task._id);
  }

  async function handleDelete(id: string) {
    if (!token) return;
    const confirmed = window.confirm('Delete this task?');
    if (!confirmed) return;
    try {
      await apiRequest<{ message: string }>(`/api/tasks/${id}`, {
        method: 'DELETE',
        token,
      });
      await loadTasks();
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  }

  function handleLogout() {
    clearToken();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[#1d1d1f]">
            Task Tracker
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-[#1d1d1f] hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-semibold text-[#1d1d1f]">
            Filters
          </h2>
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff]"
            >
              <option value="">All statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title or description"
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1d1d1f] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff]"
              />
              <button
                type="button"
                onClick={() => setSearch(searchInput)}
                className="px-4 py-2 text-sm rounded-lg bg-[#007aff] text-white font-medium hover:bg-[#0051d5] transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-semibold text-[#1d1d1f]">
            {editingId ? 'Edit Task' : 'Create Task'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1d1d1f] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff]"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1d1d1f] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff]"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="dueDate">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff]"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#007aff] text-sm font-medium text-white hover:bg-[#0051d5] transition-colors"
              >
                {editingId ? 'Update Task' : 'Create Task'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-[#1d1d1f] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1d1d1f]">Your Tasks</h2>
            {loading && <span className="text-sm text-gray-500">Loading...</span>}
          </div>
          {tasks.length === 0 && !loading ? (
            <p className="text-sm text-gray-500">
              No tasks yet. Create your first task above.
            </p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="border-b border-gray-100 last:border-b-0 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-[#1d1d1f]">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          task.priority === 'high'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : task.priority === 'medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-green-50 text-green-700 border border-green-200'
                        }`}
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
                      </span>
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                        {task.status === 'todo'
                          ? 'To Do'
                          : task.status === 'in_progress'
                          ? 'In Progress'
                          : 'Done'}
                      </span>
                      {task.dueDate && (
                        <span className="text-gray-600">Due {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <button
                      type="button"
                      onClick={() => handleEdit(task)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs text-[#1d1d1f] hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(task._id)}
                      className="px-3 py-1.5 rounded-lg border border-red-300 bg-white text-xs text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}


