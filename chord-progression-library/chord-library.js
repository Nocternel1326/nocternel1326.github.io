// chord-library.js
const ChordProgressionLibrary = (() => {
  // Chord quality intervals (semitones from root)
  const CHORDS = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    diminished: [0, 3, 6],
    augmented: [0, 4, 8],
    maj7: [0, 4, 7, 11],
    min7: [0, 3, 7, 10],
    dom7: [0, 4, 7, 10],
    dim7: [0, 3, 6, 9],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
  };

  const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  // Roman numeral → semitone offset in MAJOR key
  const ROMAN_MAJOR = {
    I: 0, ii: 2, iii: 4, IV: 5, V: 7, vi: 9, vii: 11,
    "vii°": 11,
  };

  // Roman numeral → semitone offset in MINOR key (natural minor)
  const ROMAN_MINOR = {
    i: 0, "ii°": 2, III: 3, iv: 5, v: 7, VI: 8, VII: 10,
    V: 7, "vii°": 11, // harmonic minor additions
  };

  // Roman numeral → chord quality (major key context)
  const QUALITY_MAJOR = {
    I: "major", ii: "minor", iii: "minor", IV: "major",
    V: "major", vi: "minor", vii: "diminished", "vii°": "diminished",
  };

  // Roman numeral → chord quality (minor key context)
  const QUALITY_MINOR = {
    i: "minor", "ii°": "diminished", III: "major", iv: "minor",
    v: "minor", VI: "major", VII: "major",
    V: "major", "vii°": "diminished",
  };

  // Curated progression library
  const PROGRESSIONS = {
    // --- Major key ---
    "I-IV-V-I":          { numerals: ["I", "IV", "V", "I"],                 mode: "major" },
    "I-V-vi-IV":         { numerals: ["I", "V", "vi", "IV"],                mode: "major" },
    "vi-IV-I-V":         { numerals: ["vi", "IV", "I", "V"],                mode: "major" },
    "I-vi-IV-V":         { numerals: ["I", "vi", "IV", "V"],                mode: "major" },
    "ii-V-I":            { numerals: ["ii", "V", "I"],                      mode: "major" },
    "I-iii-IV-V":        { numerals: ["I", "iii", "IV", "V"],               mode: "major" },
    "IV-V-iii-vi":       { numerals: ["IV", "V", "iii", "vi"],              mode: "major" },
    "I-IV-vi-V":         { numerals: ["I", "IV", "vi", "V"],                mode: "major" },
    "I-vi-ii-V":         { numerals: ["I", "vi", "ii", "V"],                mode: "major" },
    "Canon (Pachelbel)": { numerals: ["I", "V", "vi", "iii", "IV", "I", "IV", "V"], mode: "major" },

    // --- Minor key ---
    "i-iv-v-i":          { numerals: ["i", "iv", "v", "i"],                 mode: "minor" },
    "i-VI-III-VII":      { numerals: ["i", "VI", "III", "VII"],             mode: "minor" },
    "i-VII-VI-VII":      { numerals: ["i", "VII", "VI", "VII"],             mode: "minor" },
    "i-iv-VII-III":      { numerals: ["i", "iv", "VII", "III"],             mode: "minor" },
    "i-iv-v-i (harmonic)": { numerals: ["i", "iv", "V", "i"],               mode: "minor" },
    "i-ii°-V-i":         { numerals: ["i", "ii°", "V", "i"],                mode: "minor" },

    // --- Blues / jazz ---
    "12-bar-blues":      { numerals: ["I","I","I","I","IV","IV","I","I","V","IV","I","V"], mode: "major" },
    "8-bar-blues":       { numerals: ["I","I","IV","IV","I","I","V","I"],   mode: "major" },
    "rhythm-changes-A":  { numerals: ["I","vi","ii","V"],                   mode: "major" },
    "rhythm-changes-B":  { numerals: ["I","vi","ii","V","I","vi","ii","V"], mode: "major" },
    "jazz-turnaround":   { numerals: ["I","vi","ii","V"],                   mode: "major" },
  };

  // ---------- Helpers ----------

  function noteToMidi(note, octave = 4) {
    const index = NOTE_NAMES.indexOf(note);
    if (index === -1) throw new Error(`Unknown note: ${note}`);
    return index + (octave + 1) * 12;
  }

  function midiToNote(midi) {
    const name = NOTE_NAMES[((midi % 12) + 12) % 12];
    const octave = Math.floor(midi / 12) - 1;
    return `${name}${octave}`;
  }

  function stripOctave(noteWithOctave) {
    return noteWithOctave.replace(/-?\d+$/, "");
  }

  function buildChord(rootNote, quality = "major", octave = 4) {
    const intervals = CHORDS[quality];
    if (!intervals) throw new Error(`Unknown chord quality: ${quality}`);
    const rootMidi = noteToMidi(rootNote, octave);
    return intervals.map((i) => midiToNote(rootMidi + i));
  }

  // ---------- Public API ----------

  /**
   * Get a progression as an array of chord objects.
   * @param {string} name  - key in PROGRESSIONS, e.g. "ii-V-I"
   * @param {string} key   - root key, e.g. "C"
   * @param {number} octave - starting octave (default 4)
   * @returns {Array<{roman, root, quality, notes}>}
   */
  function getProgression(name, key = "C", octave = 4) {
    const entry = PROGRESSIONS[name];
    if (!entry) throw new Error(`Unknown progression: ${name}`);

    const { numerals, mode } = entry;
    const offsetMap = mode === "minor" ? ROMAN_MINOR : ROMAN_MAJOR;
    const qualityMap = mode === "minor" ? QUALITY_MINOR : QUALITY_MAJOR;
    const keyMidi = noteToMidi(key, octave);

    return numerals.map((roman) => {
      const offset = offsetMap[roman];
      const quality = qualityMap[roman];
      if (offset === undefined || quality === undefined) {
        throw new Error(`Unknown Roman numeral "${roman}" in ${mode} mode`);
      }
      const rootMidi = keyMidi + offset;
      const rootNote = stripOctave(midiToNote(rootMidi));
      return {
        roman,
        root: rootNote,
        quality,
        notes: buildChord(rootNote, quality, octave),
      };
    });
  }

  function listProgressions() {
    return Object.keys(PROGRESSIONS);
  }

  function getProgressionInfo(name) {
    return PROGRESSIONS[name] || null;
  }

  return {
    getProgression,
    listProgressions,
    getProgressionInfo,
    buildChord,
    noteToMidi,
    midiToNote,
    CHORDS,
    PROGRESSIONS,
  };
})();

// Expose globally for the demo page
if (typeof window !== "undefined") {
  window.ChordProgressionLibrary = ChordProgressionLibrary;
}

// Self-test (open browser console to verify)
if (typeof window !== "undefined" && window.console) {
  console.log("[chord-library] Loaded progressions:", ChordProgressionLibrary.listProgressions().length);
  console.log("[chord-library] Example — ii-V-I in C:",
    ChordProgressionLibrary.getProgression("ii-V-I", "C"));
  console.log("[chord-library] Example — i-VI-III-VII in A minor:",
    ChordProgressionLibrary.getProgression("i-VI-III-VII", "A"));
}
