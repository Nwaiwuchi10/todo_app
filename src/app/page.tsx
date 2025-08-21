"use client";

import TodoList from "@/components/TodoList";
import Head from "next/head";

import { useState } from "react";

export default function Home() {
  const [refresh] = useState(false);

  return (
    <>
      <Head>
        <title>Todo App Landing Page </title>
      </Head>
      <main className="min-h-screen p-8 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Project Manager
          </h1>

          <TodoList key={refresh.toString()} />
        </div>
      </main>
    </>
  );
}
