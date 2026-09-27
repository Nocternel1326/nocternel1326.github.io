from src import Chord, library
from src.theory import roman_to_chord, scale_notes


def test_chord_notes():
    assert Chord("C", "maj").notes == ["C", "E", "G"]
    assert Chord("A", "min").notes == ["A", "C", "E"]
    assert Chord("G", "7").notes == ["G", "B", "D", "F"]


def test_transpose():
    assert Chord("C", "maj").transpose(2).root == "D"


def test_scale():
    assert scale_notes("C") == ["C", "D", "E", "F", "G", "A", "B"]


def test_roman_in_c():
    assert str(roman_to_chord("C", "major", "I")) == "C"
    assert str(roman_to_chord("C", "major", "V")) == "G"
    assert str(roman_to_chord("C", "major", "vi")) == "Amin"


def test_realize_progression():
    chords = library.get_progression("Pop Progression", key="C")
    assert [str(c) for c in chords] == ["C", "G", "Amin", "F"]
