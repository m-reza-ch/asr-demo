import json, datetime, os
from vosk import Model, KaldiRecognizer

MODEL_PATH = "./vosk-model-fa-0.42"
model = Model(MODEL_PATH)


def create_vosk_recognizer():
    return KaldiRecognizer(model, 16000)
