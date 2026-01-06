from fastapi import FastAPI, File, WebSocket, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import json, tempfile
from stt.normalizer import normalize_fa
from stt.vosk_service import create_vosk_recognizer
from stt.whisper_sharif_service import transcribe_whisper
from stt.whisper_service import transcribe_whisper
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- VOSK (REALTIME) ----------
@app.websocket("/ws/vosk")
async def vosk_ws(ws: WebSocket):
    await ws.accept()
    rec = create_vosk_recognizer()
    try:
        while True:
            msg = await ws.receive()
            if "bytes" in msg:
                if rec.AcceptWaveform(msg["bytes"]):
                    await ws.send_text(rec.Result())
                else:
                    await ws.send_text(rec.PartialResult())

    except Exception:
        # client disconnected cleanly
        pass


# ---------- WHISPER (BATCH) ----------
@app.post("/api/whisper")
async def whisper_api(file: UploadFile):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await file.read())
        path = tmp.name

    raw_text = transcribe_whisper(path)
    normalized_text = normalize_fa(raw_text)
    return {"text": normalized_text}
