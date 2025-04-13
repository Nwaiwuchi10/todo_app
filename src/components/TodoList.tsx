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
  const [status, setStatus] = useState("pending");

  const fetchTodos = async () => {
    const { data } = await Api.get("/");
    setTodos(data);
  };

  const deleteTodo = async (id: string) => {
    await Api.delete(`/${id}`);
    fetchTodos();
  };

  const openModal = (todo: any) => {
    setCurrentTodo(todo);
    setComment(todo.description);
    setStatus(todo.status);
    setIsOpen(true);
  };

  const updateTodo = async () => {
    await Api.put(`/${currentTodo._id}`, {
      comment,
      status,
    });
    setIsOpen(false);
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold">All Todos</h2>
      {todos.map((todo) => (
        <div key={todo._id} className="p-4 border rounded shadow relative">
          <h3 className="font-bold">{todo.projectName}</h3>
          <p>{todo.description}</p>
          <p className="text-sm text-gray-500">Status: {todo.status}</p>

          <div className="absolute top-2 right-2 flex gap-2">
            <FiEdit2
              className="text-blue-500 cursor-pointer"
              onClick={() => openModal(todo)}
            />
            <FiTrash2
              className="text-red-500 cursor-pointer"
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
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  className="w-full mt-1 border px-3 py-2 rounded"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
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
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={updateTodo}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
