from hazm import Normalizer

normalizer = Normalizer()


def normalize_fa(text: str) -> str:
    if not text:
        return ""
    return normalizer.normalize(text)
