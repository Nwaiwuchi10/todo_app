"use client";
import TodoForm from "@/components/TodoForm";
import React, { useState } from "react";

const page = () => {
  const [refresh, setRefresh] = useState(false);
  return (
    <div>
      <main className="min-h-screen p-8 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-md">
          <TodoForm onCreated={() => setRefresh(!refresh)} />
        </div>
      </main>
    </div>
  );
};

export default page;
