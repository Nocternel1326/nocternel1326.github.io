"""Core chord representation."""
from dataclasses import dataclass, field
from typing import List, Optional

# Chromatic scale using sharps (canonical form)
NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

# Common chord qualities -> semitone intervals from root
CHORD_QUALITIES = {
    "maj":   [0, 4, 7],
    "min":   [0, 3, 7],
    "dim":   [0, 3, 6],
    "aug":   [0, 4, 8],
    "sus2":  [0, 2, 7],
    "sus4":  [0, 5, 7],
    "maj7":  [0, 4, 7, 11],
    "min7":  [0, 3, 7, 10],
    "7":     [0, 4, 7, 10],
    "dim7":  [0, 3, 6, 9],
    "m7b5":  [0, 3, 6, 10],
    "maj9":  [0, 4, 7, 11, 14],
    "min9":  [0, 3, 7, 10, 14],
    "9":     [0, 4, 7, 10, 14],
    "add9":  [0, 4, 7, 14],
    "6":     [0, 4, 7, 9],
    "min6":  [0, 3, 7, 9],
}


@dataclass(frozen=True)
class Chord:
    root: str
    quality: str = "maj"
    inversion: int = 0

    def __post_init__(self):
        if self.root not in NOTES:
            raise ValueError(f"Unknown root note: {self.root}")
        if self.quality not in CHORD_QUALITIES:
            raise ValueError(f"Unknown quality: {self.quality}")

    @property
    def intervals(self) -> List[int]:
        return CHORD_QUALITIES[self.quality]

    @property
    def notes(self) -> List[str]:
        root_idx = NOTES.index(self.root)
        raw = [(root_idx + i) % 12 for i in self.intervals]
        # apply inversion by rotating
        inv = self.inversion % len(raw)
        raw = raw[inv:] + raw[:inv]
        return [NOTES[i] for i in raw]

    def transpose(self, semitones: int) -> "Chord":
        new_idx = (NOTES.index(self.root) + semitones) % 12
        return Chord(NOTES[new_idx], self.quality, self.inversion)

    def __str__(self) -> str:
        suffix = "" if self.quality == "maj" else self.quality
        inv = f"/{self.notes[0]}" if self.inversion else ""
        return f"{self.root}{suffix}{inv}"
