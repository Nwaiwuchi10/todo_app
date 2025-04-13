"use client";
import axios from "axios";

const Api = axios.create({
  baseURL: "https://todoapp-704l.onrender.com/api/todo",
});

export default Api;
