import { useRef, useState } from "react";

export function useVoskSTT(setText) {
  const ws = useRef(null);
  const audioCtx = useRef(null);
  const processor = useRef(null);

  const [listening, setListening] = useState(false);
  const [finalText, setFinalText] = useState("");
  const [partialText, setPartialText] = useState("");

  async function start() {
    if (listening) return;

    setFinalText("");
    setPartialText("");
    setText("");
    setListening(true);

    ws.current = new WebSocket("ws://localhost:8000/ws/vosk");

    audioCtx.current = new AudioContext({ sampleRate: 16000 });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const src = audioCtx.current.createMediaStreamSource(stream);
    processor.current = audioCtx.current.createScriptProcessor(4096, 1, 1);

    src.connect(processor.current);
    processor.current.connect(audioCtx.current.destination);

    processor.current.onaudioprocess = (e) => {
      if (ws.current.readyState === 1) {
        const data = e.inputBuffer.getChannelData(0);
        const pcm = new Int16Array(data.length);
        for (let i = 0; i < data.length; i++) pcm[i] = data[i] * 32767;
        ws.current.send(pcm.buffer);
      }
    };

    ws.current.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.partial !== undefined) {
        setPartialText(msg.partial);
      }

      if (msg.text !== undefined && msg.text !== "") {
        setFinalText((prev) => prev + " " + msg.text);
        setPartialText("");
      }
    };
  }

  function stop() {
    if (!listening) return;

    ws.current.close();
    processor.current.disconnect();
    audioCtx.current.close();

    setText(finalText.trim());
    setListening(false);
  }

  return { start, stop, listening, finalText, partialText };
}
