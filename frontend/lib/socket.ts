// lib/socket.ts
import { abbr } from "framer-motion/client";
import { io } from "socket.io-client";

//const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const backendUrl = "http://localhost:5000";
export const socket = io(backendUrl);