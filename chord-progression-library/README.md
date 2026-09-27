# Chord Progression Library

A Python library for storing, searching, and realizing chord progressions.

## Features (prototype)
- Chord primitives with notes, inversions, transposition
- Roman numeral → chord resolution in any key
- Built-in catalog of common progressions (pop, jazz, blues, etc.)
- Diatonic chord lookup for major and minor keys
- Filter progressions by genre or name

## Quick start
```python
from src import library

chords = library.get_progression("Pop Progression", key="C")
# [C, G, Amin, F]
```
