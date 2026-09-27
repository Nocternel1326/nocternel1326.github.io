// demo.js
document.addEventListener("DOMContentLoaded", () => {
  const lib = window.ChordProgressionLibrary;

  if (!lib) {
    console.error("[demo] ChordProgressionLibrary not found. Is chord-library.js loaded?");
    return;
  }

  const select = document.getElementById("progression-select");
  const keySelect = document.getElementById("key-select");
  const output = document.getElementById("output");
  const btn = document.getElementById("show-btn");

  const ALL_KEYS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

  // ---- Populate dropdowns ----
  function populateProgressions() {
    select.innerHTML = "";
    const names = lib.listProgressions();
    if (names.length === 0) {
      const opt = document.createElement("option");
      opt.textContent = "(no progressions loaded)";
      opt.disabled = true;
      select.appendChild(opt);
      return;
    }
    names.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });
    console.log(`[demo] Loaded ${names.length} progressions:`, names);
  }

  function populateKeys() {
    keySelect.innerHTML = "";
    ALL_KEYS.forEach((k) => {
      const opt = document.createElement("option");
      opt.value = k;
      opt.textContent = k;
      if (k === "C") opt.selected = true;
      keySelect.appendChild(opt);
    });
  }

  // ---- Render ----
  function renderProgression(name, key) {
    let progression;
    try {
      progression = lib.getProgression(name, key);
    } catch (err) {
      output.innerHTML = `<p class="error">Error: ${err.message}</p>`;
      console.error(err);
      return;
    }

    const info = lib.getProgressionInfo(name);
    const mode = info ? info.mode : "major";

    output.innerHTML = `
      <h2>${name} <span class="mode-tag">(${key} ${mode})</span></h2>
      <div class="chords">
        ${progression
          .map(
            (chord) => `
          <div class="chord-card">
            <div class="roman">${chord.roman}</div>
            <div class="chord-name">${chord.root} ${chord.quality}</div>
            <div class="notes">${chord.notes.join(" – ")}</div>
          </div>`
          )
          .join("")}
      </div>
    `;

    console.log(`[demo] ${name} in ${key} (${mode}):`, progression);
  }

  // ---- Events ----
  btn.addEventListener("click", () => {
    renderProgression(select.value, keySelect.value);
  });

  // Auto-render when selections change
  select.addEventListener("change", () => {
    if (select.value) renderProgression(select.value, keySelect.value);
  });
  keySelect.addEventListener("change", () => {
    if (select.value) renderProgression(select.value, keySelect.value);
  });

  // ---- Init ----
  populateKeys();
  populateProgressions();

  // Render first progression on load
  if (select.value) {
    renderProgression(select.value, keySelect.value);
  }
});
