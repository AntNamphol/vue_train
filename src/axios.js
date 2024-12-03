// src/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000", // URL หลัก
  timeout: 5000, // ตั้งค่า timeout (ms)
});

export default instance;
