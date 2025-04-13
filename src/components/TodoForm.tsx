"use client";
import Api from "@/Utils/api";
import { useState } from "react";

interface TodoFormProps {
  onCreated: () => void;
}

export default function TodoForm({ onCreated }: TodoFormProps) {
  const [projectName, setProjectName] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await Api.post("/", { projectName, comment });
      setProjectName("");
      setComment("");
      onCreated();
    } catch (error) {
      console.error("Error creating todo:", error);
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
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        style={{ cursor: "pointer" }}
      >
        Add Todo
      </button>
    </form>
  );
}
