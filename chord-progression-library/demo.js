// demo.js
document.addEventListener("DOMContentLoaded", () => {
  const lib = window.ChordProgressionLibrary;
  const select = document.getElementById("progression-select");
  const keySelect = document.getElementById("key-select");
  const output = document.getElementById("output");
  const btn = document.getElementById("show-btn");

  // Populate progression dropdown
  lib.listProgressions().forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  btn.addEventListener("click", () => {
    const name = select.value;
    const key = keySelect.value;

    try {
      const progression = lib.getProgression(name, key);
      output.innerHTML = `
        <h2>${name} in ${key}</h2>
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
    } catch (err) {
      output.innerHTML = `<p class="error">Error: ${err.message}</p>`;
    }
  });
});
