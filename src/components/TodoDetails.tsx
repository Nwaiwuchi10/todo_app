"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Api from "@/Utils/api";

interface IComment {
  text: string;
  date: string;
}

interface ITodo {
  _id: string;
  projectName: string;
  status: string;
  stageUrl?: string;
  link?: string;
  comment?: string;
  desc?: string;
  date: string;
  startDate?: string;
  endDate?: string;
  slug: string;
  developers: string[];
  comments: IComment[];
}

export default function TodoDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [todo, setTodo] = useState<ITodo | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [adding, setAdding] = useState(false);

  // Fetch todo with comments
  const fetchTodo = async () => {
    try {
      const { data } = await Api.get(`/${id}`); // backend getTodoWithComments
      setTodo(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTodo();
  }, [id]);

  // Add comment handler
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      setAdding(true);
      await Api.post(`/${id}/comments`, { text: newComment });
      setShowModal(false);
      setNewComment("");
      fetchTodo(); // reload comments
    } catch (error) {
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Todo not found
      </div>
    );
  }

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

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Top Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push("/")}
          style={{ cursor: "pointer" }}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ← Go Back
        </button>
        <button
          onClick={() => setShowModal(true)}
          style={{ cursor: "pointer" }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Comment
        </button>
      </div>

      {/* Todo Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">{todo.projectName}</h1>
        <p
          className={`inline-block px-3 py-1 text-sm border rounded ${getStatusBorderColor(
            todo.status
          )}`}
        >
          {todo.status.toUpperCase()}
        </p>

        {todo.desc && <p className="text-gray-700">{todo.desc}</p>}

        <div className="grid gap-2">
          {todo.link && (
            <p>
              <span className="font-semibold">Link:</span>{" "}
              <a
                href={todo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {todo.link}
              </a>
            </p>
          )}
          {todo.stageUrl && (
            <p>
              <span className="font-semibold">Stage URL:</span>{" "}
              <a
                href={todo.stageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {todo.stageUrl}
              </a>
            </p>
          )}
          {todo.startDate && (
            <p>
              <span className="font-semibold">Start Date:</span>{" "}
              {new Date(todo.startDate).toLocaleDateString()}
            </p>
          )}
          {todo.endDate && (
            <p>
              <span className="font-semibold">End Date:</span>{" "}
              {new Date(todo.endDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Developers */}
        {todo.developers.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Developers:</h2>
            <ul className="list-disc pl-5 text-gray-700">
              {todo.developers.map((dev, idx) => (
                <li key={idx}>{dev}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Comments */}
        <div>
          <h2 className="text-lg font-semibold">Comments:</h2>
          {todo.comments.length > 0 ? (
            <div className="space-y-2 mt-2">
              {todo.comments.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-3 rounded-lg border shadow-sm"
                >
                  <p className="text-gray-700">{c.text}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(c.date).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mt-2">No comments yet</p>
          )}
        </div>

        {/* Created At */}
        <p className="text-sm text-gray-400">
          Created: {new Date(todo.date).toLocaleDateString()}
        </p>
      </div>

      {/* Add Comment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Add Comment</h2>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows={4}
              placeholder="Write your comment..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                style={{ cursor: "pointer" }}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                style={{ cursor: "pointer" }}
                disabled={adding}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add Comment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
