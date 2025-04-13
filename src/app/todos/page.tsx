"use client";
import api from "@/Utils/api";
import { useEffect, useState } from "react";

const TodosPage = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    api
      .get("/")
      .then((res) => setTodos(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">All Todos</h1>
      <div className="flex flex-wrap justify-center">
        {todos.map((todo: any) => (
          //   <TodoCard
          //     key={todo._id}
          //     title={todo.title}
          //     comment={todo.comment || "No comment"}
          //     status={todo.status}
          //   />
          <></>
        ))}
      </div>
    </div>
  );
};

export default TodosPage;
