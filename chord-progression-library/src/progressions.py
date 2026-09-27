"""Built-in progression catalog."""
from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class Progression:
    name: str
    numerals: List[str]
    mode: str = "major"        # "major" or "minor"
    genre: List[str] = field(default_factory=list)
    description: str = ""
    examples: List[str] = field(default_factory=list)

    def __len__(self):
        return len(self.numerals)

    def __str__(self):
        return f"{self.name}: {' - '.join(self.numerals)}"


# A starter catalog
CATALOG: List[Progression] = [
    Progression(
        name="Pop Progression (I-V-vi-IV)",
        numerals=["I", "V", "vi", "IV"],
        genre=["pop", "rock"],
        description="The most common pop progression in modern music.",
        examples=["Let It Be - The Beatles", "Don't Stop Believin' - Journey"],
    ),
    Progression(
        name="50s Doo-Wop (I-vi-IV-V)",
        numerals=["I", "vi", "IV", "V"],
        genre=["doo-wop", "pop", "rock"],
        description="Classic 1950s progression.",
        examples=["Stand By Me - Ben E. King"],
    ),
    Progression(
        name="Andalusian Cadence",
        numerals=["i", "VII", "VI", "V"],
        mode="minor",
        genre=["flamenco", "rock"],
        description="Descending minor progression with Phrygian flavor.",
        examples=["Sultans of Swing - Dire Straits"],
    ),
    Progression(
        name="Jazz ii-V-I",
        numerals=["ii7", "V7", "Imaj7"],
        genre=["jazz"],
        description="The fundamental jazz cadence.",
        examples=["Autumn Leaves", "All The Things You Are"],
    ),
    Progression(
        name="Pachelbel's Canon",
        numerals=["I", "V", "vi", "iii", "IV", "I", "IV", "V"],
        genre=["classical", "pop"],
        description="Canon in D progression.",
        examples=["Canon in D - Pachelbel"],
    ),
    Progression(
        name="Blues (12-bar)",
        numerals=["I7", "IV7", "I7", "V7"],
        genre=["blues"],
        description="Simplified 12-bar blues (tonic, subdominant, dominant).",
        examples=["Sweet Home Chicago"],
    ),
    Progression(
        name="Minor Pop (i-VI-III-VII)",
        numerals=["i", "VI", "III", "VII"],
        mode="minor",
        genre=["pop", "edm"],
        description="Common minor-key pop/EDM progression.",
        examples=["Save Tonight - Eagle-Eye Cherry"],
    ),
]
