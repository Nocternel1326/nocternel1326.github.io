// chord-library.js — minimal guaranteed-working version
(function () {
  console.log("[chord-library] file loaded");

  const CHORDS = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    diminished: [0, 3, 6],
    augmented: [0, 4, 8],
    maj7: [0, 4, 7, 11],
    min7: [0, 3, 7, 10],
    dom7: [0, 4, 7, 10],
  };

  const NOTE_NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

  const ROMAN_MAJOR = { I:0, ii:2, iii:4, IV:5, V:7, vi:9, "vii°":11 };
  const ROMAN_MINOR = { i:0, "ii°":2, III:3, iv:5, v:7, VI:8, VII:10, V:7, "vii°":11 };
  const QUALITY_MAJOR = { I:"major", ii:"minor", iii:"minor", IV:"major", V:"major", vi:"minor", "vii°":"diminished" };
  const QUALITY_MINOR = { i:"minor", "ii°":"diminished", III:"major", iv:"minor", v:"minor", VI:"major", VII:"major", V:"major", "vii°":"diminished" };

  const PROGRESSIONS = {
    "I-IV-V-I":          { numerals:["I","IV","V","I"],              mode:"major" },
    "I-V-vi-IV":         { numerals:["I","V","vi","IV"],             mode:"major" },
    "vi-IV-I-V":         { numerals:["vi","IV","I","V"],             mode:"major" },
    "I-vi-IV-V":         { numerals:["I","vi","IV","V"],             mode:"major" },
    "ii-V-I":            { numerals:["ii","V","I"],                  mode:"major" },
    "I-iii-IV-V":        { numerals:["I","iii","IV","V"],            mode:"major" },
    "I-vi-ii-V":         { numerals:["I","vi","ii","V"],             mode:"major" },
    "Canon (Pachelbel)": { numerals:["I","V","vi","iii","IV","I","IV","V"], mode:"major" },
    "i-iv-v-i":          { numerals:["i","iv","v","i"],              mode:"minor" },
    "i-VI-III-VII":      { numerals:["i","VI","III","VII"],          mode:"minor" },
    "i-VII-VI-VII":      { numerals:["i","VII","VI","VII"],          mode:"minor" },
    "i-iv-VII-III":      { numerals:["i","iv","VII","III"],          mode:"minor" },
    "i-ii°-V-i":         { numerals:["i","ii°","V","i"],             mode:"minor" },
    "12-bar-blues":      { numerals:["I","I","I","I","IV","IV","I","I","V","IV","I","V"], mode:"major" },
    "rhythm-changes-A":  { numerals:["I","vi","ii","V"],             mode:"major" },
  };

  function noteToMidi(note, octave) {
    octave = octave == null ? 4 : octave;
    const i = NOTE_NAMES.indexOf(note);
    if (i === -1) throw new Error("Unknown note: " + note);
    return i + (octave + 1) * 12;
  }
  function midiToNote(midi) {
    const name = NOTE_NAMES[((midi % 12) + 12) % 12];
    const octave = Math.floor(midi / 12) - 1;
    return name + octave;
  }
  function stripOctave(n) { return n.replace(/-?\d+$/, ""); }
  function buildChord(root, quality, octave) {
    const intervals = CHORDS[quality];
    if (!intervals) throw new Error("Unknown chord quality: " + quality);
    const rootMidi = noteToMidi(root, octave);
    return intervals.map(function (i) { return midiToNote(rootMidi + i); });
  }

  function getProgression(name, key, octave) {
    key = key || "C";
    octave = octave == null ? 4 : octave;
    const entry = PROGRESSIONS[name];
    if (!entry) throw new Error("Unknown progression: " + name);
    const offsetMap = entry.mode === "minor" ? ROMAN_MINOR : ROMAN_MAJOR;
    const qualityMap = entry.mode === "minor" ? QUALITY_MINOR : QUALITY_MAJOR;
    const keyMidi = noteToMidi(key, octave);
    return entry.numerals.map(function (roman) {
      const offset = offsetMap[roman];
      const quality = qualityMap[roman];
      if (offset === undefined || quality === undefined) {
        throw new Error('Unknown Roman numeral "' + roman + '" in ' + entry.mode + " mode");
      }
      const rootNote = stripOctave(midiToNote(keyMidi + offset));
      return { roman: roman, root: rootNote, quality: quality, notes: buildChord(rootNote, quality, octave) };
    });
  }

  const api = {
    getProgression: getProgression,
    listProgressions: function () { return Object.keys(PROGRESSIONS); },
    getProgressionInfo: function (n) { return PROGRESSIONS[n] || null; },
    buildChord: buildChord,
    noteToMidi: noteToMidi,
    midiToNote: midiToNote,
    CHORDS: CHORDS,
    PROGRESSIONS: PROGRESSIONS,
  };

  // Attach to global scope — this is the critical line
  window.ChordProgressionLibrary = api;
  console.log("[chord-library] attached. Progressions:", api.listProgressions().length);
})();
