"""Public API for the chord progression library."""
from typing import List, Optional

from .chords import Chord
from .theory import roman_to_chord, diatonic_chords
from .progressions import Progression, CATALOG


class ChordLibrary:
    def __init__(self):
        self._catalog = list(CATALOG)

    # --- Progression lookup ---
    def list_progressions(self, genre: Optional[str] = None) -> List[Progression]:
        if genre:
            return [p for p in self._catalog if genre.lower() in [g.lower() for g in p.genre]]
        return list(self._catalog)

    def find_by_name(self, query: str) -> List[Progression]:
        q = query.lower()
        return [p for p in self._catalog if q in p.name.lower()]

    # --- Realization ---
    def realize(self, progression: Progression, key: str) -> List[Chord]:
        """Turn a Progression into actual Chord objects in a given key."""
        return [roman_to_chord(key, progression.mode, n) for n in progression.numerals]

    def get_progression(
        self, name: str, key: str
    ) -> Optional[List[Chord]]:
        matches = self.find_by_name(name)
        if not matches:
            return None
        return self.realize(matches[0], key)

    # --- Utilities ---
    def diatonic(self, key: str, mode: str = "major"):
        return diatonic_chords(key, mode)


# Convenience singleton
library = ChordLibrary()
