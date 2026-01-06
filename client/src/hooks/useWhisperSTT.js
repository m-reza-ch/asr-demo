import { useRef, useState } from "react";

export function useWhisperSTT(setText) {
  const recorder = useRef(null);
  const chunks = useRef([]);
  const streamRef = useRef(null);
  const [listening, setListening] = useState(false);

  async function start() {
    if (listening) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    recorder.current = new MediaRecorder(stream);
    chunks.current = [];
    setListening(true);

    recorder.current.ondataavailable = (e) => chunks.current.push(e.data);

    recorder.current.onstop = async () => {
      // HARD STOP mic
      stream.getTracks().forEach((t) => t.stop());

      const blob = new Blob(chunks.current, { type: "audio/wav" });
      const fd = new FormData();
      fd.append("file", blob);

      const res = await fetch("http://localhost:8000/api/whisper", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      setText(data.text);
      setListening(false);
    };

    recorder.current.start();
  }

  function stop() {
    if (recorder.current && listening) {
      recorder.current.stop();
    }
  }

  return { start, stop, listening };
}
