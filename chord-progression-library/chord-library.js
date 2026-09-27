// chord-library.js
const ChordProgressionLibrary = (() => {
  // Basic chord definitions (root + quality)
  const CHORDS = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    diminished: [0, 3, 6],
    augmented: [0, 4, 8],
    maj7: [0, 4, 7, 11],
    min7: [0, 3, 7, 10],
    dom7: [0, 4, 7, 10],
  };

  const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  // Common progressions in Roman numeral notation
  const PROGRESSIONS = {
    "I-IV-V-I": ["I", "IV", "V", "I"],
    "ii-V-I": ["ii", "V", "I"],
    "I-V-vi-IV": ["I", "V", "vi", "IV"],
    "vi-IV-I-V": ["vi", "IV", "I", "V"],
    "I-vi-IV-V": ["I", "vi", "IV", "V"],
    "12-bar-blues": ["I", "I", "I", "I", "IV", "IV", "I", "I", "V", "IV", "I", "V"],
  };

  // Map Roman numerals to semitone offsets and qualities (major key)
  const ROMAN_TO_SEMITONE = {
    I: 0, ii: 2, iii: 4, IV: 5, V: 7, vi: 9, vii: 11,
    i: 0, ii°: 2, III: 4, iv: 5, v: 7, VI: 9, VII: 11,
  };

  const ROMAN_QUALITY = {
    I: "major", ii: "minor", iii: "minor", IV: "major", V: "major", vi: "minor", vii: "diminished",
    i: "minor", ii°: "diminished", III: "major", iv: "minor", v: "minor", VI: "major", VII: "major",
  };

  function noteToMidi(note, octave = 4) {
    const index = NOTE_NAMES.indexOf(note);
    if (index === -1) throw new Error(`Unknown note: ${note}`);
    return index + (octave + 1) * 12;
  }

  function midiToNote(midi) {
    const name = NOTE_NAMES[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    return `${name}${octave}`;
  }

  function buildChord(rootNote, quality = "major", octave = 4) {
    const intervals = CHORDS[quality];
    if (!intervals) throw new Error(`Unknown chord quality: ${quality}`);
    const rootMidi = noteToMidi(rootNote, octave);
    return intervals.map((i) => midiToNote(rootMidi + i));
  }

  /**
   * Get a progression as an array of chord objects.
   * @param {string} name - key in PROGRESSIONS, e.g. "ii-V-I"
   * @param {string} key - root key, e.g. "C"
   * @param {number} octave
   */
  function getProgression(name, key = "C", octave = 4) {
    const romanNumerals = PROGRESSIONS[name];
    if (!romanNumerals) throw new Error(`Unknown progression: ${name}`);

    const keyMidi = noteToMidi(key, octave);

    return romanNumerals.map((roman) => {
      const offset = ROMAN_TO_SEMITONE[roman];
      const quality = ROMAN_QUALITY[roman];
      const rootMidi = keyMidi + offset;
      const rootNote = midiToNote(rootMidi);
      // buildChord expects a note name; strip octave
      const noteName = rootNote.replace(/\d/, "");
      return {
        roman,
        root: noteName,
        quality,
        notes: buildChord(noteName, quality, octave),
      };
    });
  }

  function listProgressions() {
    return Object.keys(PROGRESSIONS);
  }

  return {
    getProgression,
    listProgressions,
    buildChord,
    CHORDS,
    PROGRESSIONS,
  };
})();

// Make it available globally for the demo page
window.ChordProgressionLibrary = ChordProgressionLibrary;
