"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateCreativeProduct = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [fileType, setFileType] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const createDto = {
      title,
      description,
      category,
      price,
      fileType,
    };

    const formData = new FormData();
    formData.append("createDto", JSON.stringify(createDto));

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("fileUrl", file);
      });
    }

    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2RhOWUxZjNjYjQyMTBkZWU4MDA5MWUiLCJpYXQiOjE3NDUxODA1MzksImV4cCI6MTc0NTIxNjUzOX0.uCd8j3DWuSOzfDgkRVJgqV-9CXLrIKvS9kt0oOAs7pE";
      //   const token = localStorage.getItem("token"); //
      const response = await axios.post(
        "https://ads-api.ogini.com/cretive-products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Created:", response.data);
      router.push("/test");
    } catch (error: any) {
      console.error(
        "Error creating creative product:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div
      style={{
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "50px",
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="File Type"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="border p-2 w-full"
          accept="image/*,audio/*,video/*,application/pdf"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateCreativeProduct;
