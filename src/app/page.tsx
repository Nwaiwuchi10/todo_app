"use client";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import Head from "next/head";

import { useState } from "react";

export default function Home() {
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <Head>
        <title>Todo App Landing Page</title>
      </Head>
      <main className="min-h-screen p-8 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center">Todo Manager</h1>
          <TodoForm onCreated={() => setRefresh(!refresh)} />
          <TodoList key={refresh.toString()} />
        </div>
      </main>
    </>
  );
}
