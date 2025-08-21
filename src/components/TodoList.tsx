"use client";
import Api from "@/Utils/api";
import { useEffect, useState } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import Link from "next/link";

export default function TodoList() {
  const [todos, setTodos] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<any>(null);

  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [projectName, setProjectName] = useState("");
  const [stageUrl, setStageUrl] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [developers, setDevelopers] = useState<string[]>([]);
  const [developerInput, setDeveloperInput] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTodos = async () => {
    const { data } = await Api.get("/");
    setTodos(data);
  };

  const deleteTodo = async () => {
    if (!currentTodo) return;
    setDeletingId(currentTodo._id);
    try {
      await Api.delete(`/${currentTodo._id}`);
      fetchTodos();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error Deleting todo:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const openModal = (todo: any) => {
    setCurrentTodo(todo);
    setProjectName(todo.projectName);
    setDesc(todo.desc || "");
    setLink(todo.link || "");
    setStageUrl(todo.stageUrl || "");
    setDevelopers(todo.developers || []);
    setStartDate(todo.startDate || "");
    setEndDate(todo.endDate || "");
    setStatus(todo.status);
    setIsOpen(true);
  };

  const openDeleteModal = (todo: any) => {
    setCurrentTodo(todo);
    setIsDeleteOpen(true);
  };

  const updateTodo = async () => {
    setSaving(true);
    try {
      await Api.put(`/${currentTodo._id}`, {
        projectName,
        desc,
        link,
        stageUrl,
        developers,
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
  const handleAddDeveloper = () => {
    if (developerInput.trim() !== "") {
      setDevelopers([...developers, developerInput.trim()]);
      setDeveloperInput("");
    }
  };

  const handleRemoveDeveloper = (index: number) => {
    setDevelopers(developers.filter((_, i) => i !== index));
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          <Link href="/create">All Projects</Link>
        </h2>
        <Link href="/create">
          <button
            type="button"
            style={{ cursor: "pointer" }}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            Add Project
          </button>
        </Link>
      </div>

      <div className="space-y-4 mt-6">
        {todos.map((todo: any) => (
          <div key={todo._id} className="p-4 border rounded shadow relative">
            <h3 className="font-bold">{todo?.projectName}</h3>

            {todo?.link && (
              <p className="mt-2">
                Project Url:{" "}
                <a
                  href={todo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-words"
                >
                  {todo?.link}
                </a>
              </p>
            )}

            {todo?.stageUrl && (
              <p className="mt-2">
                Staging Url:{" "}
                <a
                  href={todo.stageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-800 underline break-words"
                >
                  {todo?.stageUrl}
                </a>
              </p>
            )}

            <p className="mt-2">Start Date: {formatDate(todo?.startDate)}</p>
            <p className="mt-2">End Date: {formatDate(todo?.endDate)}</p>

            <div className="flex flex-col sm:flex-row sm:justify-between items-start mt-3 gap-2">
              <p
                className={`inline-block px-2 py-1 text-sm border rounded ${getStatusBorderColor(
                  todo.status
                )}`}
              >
                Status: {todo.status}
              </p>
              <Link
                href={`/todos/${todo._id}`}
                style={{ cursor: "pointer" }}
                className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
              >
                View Details
              </Link>
            </div>

            <div className="absolute top-2 right-2 flex gap-2">
              <FiEdit2
                className="text-blue-500 cursor-pointer"
                onClick={() => openModal(todo)}
              />
              <FiTrash2
                className="text-red-500 cursor-pointer"
                onClick={() => openDeleteModal(todo)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* UPDATE MODAL */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded shadow max-w-md w-full overflow-y-auto max-h-[90vh]">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Update Project
            </Dialog.Title>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full border p-2 rounded"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />

              <label className="block text-sm font-medium">Description</label>
              <textarea
                className="w-full mt-1 border px-3 py-2 rounded"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />

              <input
                type="text"
                placeholder="Project Link"
                className="w-full border p-2 rounded"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />

              <input
                type="text"
                placeholder="Stage URL"
                className="w-full border p-2 rounded"
                value={stageUrl}
                onChange={(e) => setStageUrl(e.target.value)}
              />

              {/* Developers Input */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Developers
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter developer name"
                    className="flex-1 border p-2 rounded"
                    value={developerInput}
                    onChange={(e) => setDeveloperInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-3 py-2 rounded"
                    style={{ cursor: "pointer" }}
                    onClick={handleAddDeveloper}
                  >
                    Add
                  </button>
                </div>
                <ul className="mt-2 space-y-1">
                  {developers.map((dev, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between border p-2 rounded"
                    >
                      <span>{dev}</span>
                      <button
                        type="button"
                        className="text-red-600"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveDeveloper(index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

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
                  onClick={() => setIsOpen(false)}
                  style={{ cursor: "pointer" }}
                  className="px-4 py-2 text-gray-700 border rounded"
                >
                  Cancel
                </button>
                <button
                  style={{ cursor: "pointer" }}
                  onClick={updateTodo}
                  className="px-4 py-2 bg-blue-600 text-white rounded min-w-[120px]"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded shadow max-w-sm w-full text-center">
            <Dialog.Title className="text-lg font-semibold mb-2">
              Confirm Delete
            </Dialog.Title>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete <b>{currentTodo?.projectName}</b>?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                style={{ cursor: "pointer" }}
                className="px-4 py-2 border rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={deleteTodo}
                style={{ cursor: "pointer" }}
                className="px-4 py-2 bg-red-600 text-white rounded min-w-[100px]"
                disabled={deletingId === currentTodo?._id}
              >
                {deletingId === currentTodo?._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
