"use client";
import Api from "@/Utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TodoFormProps {
  onCreated: () => void;
}

export default function TodoForm({ onCreated }: TodoFormProps) {
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  // const [comment, setComment] = useState("");
  const [link, setLink] = useState("");
  const [stageUrl, setStageUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [developers, setDevelopers] = useState<string[]>([]);
  const [developerInput, setDeveloperInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddDeveloper = () => {
    if (developerInput.trim() !== "") {
      setDevelopers([...developers, developerInput.trim()]);
      setDeveloperInput("");
    }
  };

  const handleRemoveDeveloper = (index: number) => {
    setDevelopers(developers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Api.post("/", {
        projectName,
        // comment,
        link,
        stageUrl,
        desc,
        developers,
        startDate,
        endDate,
      });
      // reset form
      setProjectName("");
      // setComment("");
      setLink("");
      setStageUrl("");
      setDesc("");
      setDevelopers([]);
      setDeveloperInput("");
      setStartDate("");
      setEndDate("");
      onCreated();
      router.push("/");
    } catch (error) {
      console.error("Error creating todo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4 text-center">Create Project</h1>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4 mb-6">
        <button
          onClick={() => router.push("/")}
          style={{ cursor: "pointer" }}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ← Go Back
        </button>
        <button
          onClick={() => router.push("/")}
          style={{ cursor: "pointer" }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View Projects
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        {/* <textarea
        placeholder="Comment"
        className="w-full border p-2 rounded"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      /> */}

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
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
          placeholder="Staging URL"
          className="w-full border p-2 rounded"
          value={stageUrl}
          onChange={(e) => setStageUrl(e.target.value)}
        />

        {/* Developers Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Developers</label>
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
            "Add Project"
          )}
        </button>
      </form>
    </>
  );
}
