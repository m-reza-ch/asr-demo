import { Routes, Route, Navigate } from "react-router-dom";
import WhisperPage from "./pages/WhisperPage";
import VoskPage from "./pages/VoskPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/whisper" />} />
      <Route path="/whisper" element={<WhisperPage />} />
      <Route path="/vosk" element={<VoskPage />} />
    </Routes>
  );
}
