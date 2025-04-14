"use client";

import Api from "@/Utils/api";
import { useEffect, useState } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { Dialog } from "@headlessui/react";

export default function TodoList() {
  const [todos, setTodos] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [link, setLink] = useState("");
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("pending");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fetchTodos = async () => {
    const { data } = await Api.get("/");
    setTodos(data);
  };

  const deleteTodo = async (id: string) => {
    setDeletingId(id);
    try {
      await Api.delete(`/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Error Deleting todo:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const openModal = (todo: any) => {
    setCurrentTodo(todo);
    setProjectName(todo.projectName);
    setComment(todo.description);
    setLink(todo.link);
    setStartDate(todo.startDate);
    setEndDate(todo.endDate);
    setStatus(todo.status);
    setIsOpen(true);
  };

  const updateTodo = async () => {
    setSaving(true);
    try {
      await Api.put(`/${currentTodo._id}`, {
        projectName,
        comment,
        link,
        startDate,
        endDate,
        status,
      });
      setIsOpen(false);
      fetchTodos();
    } catch (error) {
      console.error("Error Updating todo:", error);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case "pending":
        return "border-purple-500 text-purple-700";
      case "in-progress":
        return "border-yellow-500 text-yellow-700";
      case "completed":
        return "border-green-500 text-green-700";
      default:
        return "border-gray-300";
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold">All Todos</h2>
      {todos.map((todo: any) => (
        <div key={todo._id} className="p-4 border rounded shadow relative">
          <h3 className="font-bold">{todo?.projectName}</h3>
          <p className="mt-2">{todo?.description}</p>
          <p className="mt-2">
            <a
              href={todo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {todo?.link}
            </a>
          </p>
          <p className="mt-2">Start Date: {formatDate(todo?.startDate)}</p>
          <p className="mt-2">End Date: {formatDate(todo?.endDate)}</p>
          <p
            className={`inline-block mt-2 mb-2 px-2 py-1 text-sm border rounded ${getStatusBorderColor(
              todo.status
            )}`}
          >
            Status: {todo.status}
          </p>

          <div className="absolute top-2 right-2 flex gap-2">
            <FiEdit2
              style={{ cursor: "pointer" }}
              className="text-blue-500 cursor-pointer"
              onClick={() => openModal(todo)}
            />
            <FiTrash2
              style={{ cursor: "pointer" }}
              className={`text-red-500 cursor-pointer ${
                deletingId === todo._id ? "animate-spin opacity-50" : ""
              }`}
              onClick={() => deleteTodo(todo._id)}
            />
          </div>
        </div>
      ))}

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded shadow max-w-md w-full">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Update Todo
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full border p-2 rounded mb-4"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  className="w-full mt-1 border px-3 py-2 rounded"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Project Link"
                  className="w-full border p-2 rounded mt-4"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <label className="block text-sm font-medium pt-4 pb-4">
                  Start Date
                </label>
                <input
                  type="date"
                  placeholder="Start Date"
                  className="w-full border p-2 rounded"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <label className="block text-sm font-medium pt-4 pb-4">
                  End Date
                </label>
                <input
                  type="date"
                  placeholder="End Date"
                  className="w-full border p-2 rounded"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  className="w-full mt-1 border px-3 py-2 rounded"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 border rounded"
                >
                  Cancel
                </button>
                <button
                  style={{ cursor: "pointer" }}
                  onClick={updateTodo}
                  className="px-4 py-2 bg-blue-600 text-white rounded flex items-center justify-center min-w-[120px]"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
