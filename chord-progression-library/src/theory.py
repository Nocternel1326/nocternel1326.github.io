"""Music theory helpers: keys, scales, roman numeral parsing."""
from typing import List, Dict

NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11]
MINOR_SCALE = [0, 2, 3, 5, 7, 8, 10]  # natural minor

# Diatonic chord qualities per scale degree
MAJOR_DEGREES = [
    ("I", "maj"), ("ii", "min"), ("iii", "min"), ("IV", "maj"),
    ("V", "maj"), ("vi", "min"), ("vii°", "dim"),
]

MINOR_DEGREES = [
    ("i", "min"), ("ii°", "dim"), ("III", "maj"), ("iv", "min"),
    ("v", "min"), ("VI", "maj"), ("VII", "maj"),
]

ROMAN_TO_INDEX = {
    "i": 0, "ii": 1, "iii": 2, "iv": 3, "v": 4, "vi": 5, "vii": 6,
}


def scale_notes(key: str, mode: str = "major") -> List[str]:
    root_idx = NOTES.index(key)
    pattern = MAJOR_SCALE if mode == "major" else MINOR_SCALE
    return [NOTES[(root_idx + i) % 12] for i in pattern]


def diatonic_chords(key: str, mode: str = "major") -> Dict[str, "Chord"]:
    """Map roman numerals to actual chords in the key."""
    from .chords import Chord
    notes = scale_notes(key, mode)
    degrees = MAJOR_DEGREES if mode == "major" else MINOR_DEGREES
    return {
        numeral: Chord(notes[i], quality)
        for i, (numeral, quality) in enumerate(degrees)
    }


def roman_to_chord(key: str, mode: str, numeral: str) -> "Chord":
    """Convert a roman numeral (with optional quality tweak) to a Chord."""
    from .chords import Chord

    # Detect accidental tweaks like bVII, #IV
    accidental = 0
    clean = numeral
    if numeral.startswith("b"):
        accidental = -1
        clean = numeral[1:]
    elif numeral.startswith("#"):
        accidental = 1
        clean = numeral[1:]

    # Strip quality markers for lookup
    base = clean.rstrip("°ø+").lower()
    if base not in ROMAN_TO_INDEX:
        raise ValueError(f"Invalid roman numeral: {numeral}")

    degree_idx = ROMAN_TO_INDEX[base]
    notes = scale_notes(key, mode)
    root_idx = (NOTES.index(notes[degree_idx]) + accidental) % 12
    root = NOTES[root_idx]

    # Determine quality
    if "°" in numeral:
        quality = "dim"
    elif "ø" in numeral:
        quality = "m7b5"
    elif "+" in numeral:
        quality = "aug"
    elif clean.islower():
        quality = "min"
    else:
        quality = "maj"

    # Handle explicit 7ths etc. appended like "V7"
    if numeral.endswith("7") and quality == "maj":
        quality = "7"
    elif numeral.endswith("7") and quality == "min":
        quality = "min7"

    return Chord(root, quality)
