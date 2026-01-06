import whisper

model = whisper.load_model("large-v3")


def transcribe_whisper(file_path: str):
    result = model.transcribe(file_path, language="fa")
    return result["text"]
