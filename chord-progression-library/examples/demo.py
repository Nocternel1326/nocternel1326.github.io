from src import library, Chord

# List all pop progressions
print("=== Pop Progressions ===")
for p in library.list_progressions(genre="pop"):
    print(f"  {p}")

# Realize a progression in a key
print("\n=== I-V-vi-IV in C major ===")
chords = library.get_progression("Pop Progression", key="C")
for c in chords:
    print(f"  {c}  -> {c.notes}")

# Jazz ii-V-I in F
print("\n=== ii-V-I in F ===")
for c in library.get_progression("Jazz ii-V-I", key="F"):
    print(f"  {c} -> {c.notes}")

# Diatonic chords of A minor
print("\n=== Diatonic chords in A minor ===")
for numeral, chord in library.diatonic("A", mode="minor").items():
    print(f"  {numeral:5s} {chord}  {chord.notes}")

# Ad-hoc chord
print("\n=== Custom chord ===")
print(Chord("D", "min7").notes)
