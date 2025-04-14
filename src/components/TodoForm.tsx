"use client";
import Api from "@/Utils/api";
import { useState } from "react";

interface TodoFormProps {
  onCreated: () => void;
}

export default function TodoForm({ onCreated }: TodoFormProps) {
  const [projectName, setProjectName] = useState("");
  const [comment, setComment] = useState("");
  const [link, setLink] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Api.post("/", { projectName, comment, startDate, endDate, link });
      setProjectName("");
      setComment("");
      setLink("");
      setProjectName("");
      setStartDate("");
      setEndDate("");
      onCreated();
    } catch (error) {
      console.error("Error creating todo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        className="w-full border p-2 rounded"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="w-full border p-2 rounded"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <input
        type="text"
        placeholder="Project Link"
        className="w-full border p-2 rounded"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <label className="block text-sm font-medium">Start Date</label>
      <input
        type="date"
        placeholder="Start Date"
        className="w-full border p-2 rounded"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <label className="block text-sm font-medium">End Date</label>
      <input
        type="date"
        placeholder="End Date"
        className="w-full border p-2 rounded"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
        style={{ cursor: "pointer" }}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="loader border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Add Todo"
        )}
      </button>
    </form>
  );
}
