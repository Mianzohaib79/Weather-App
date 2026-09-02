import { message } from "antd";

window.toastify = (msg, type) => (message[type] || message.info)(msg);

window.getRandomId = () => Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

window.isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Localhost 8000 (Jab tak production backend deploy na ho)
window.API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
window.api = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';