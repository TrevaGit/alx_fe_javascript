// -----------------------------
// Web storage + JSON features
// -----------------------------

// Save quotes array to local storage
function saveQuotesToStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes from local storage, return null if none
function loadQuotesFromStorage() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error("Failed to parse stored quotes:", e);
    }
  }
  return null;
}

// -----------------------------
// Data: quotes array
// -----------------------------
let quotes = loadQuotesFromStorage() || [
  { text: "Stay positive, work hard!", category: "Motivation" },
  { text: "Knowledge is power.", category: "Education" },
  { text: "Great things take time.", category: "Inspiration" }
];

// -----------------------------
// displayRandomQuote (required name)
// selects a random quote, updates DOM, stores last viewed in sessionStorage
// -----------------------------
function displayRandomQuote() {
  if (!quotes.length) {
    document.getElementById("quoteDisplay").innerText = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${quote.text}</p>
    <p><strong>Category:</strong> ${quote.category}</p>
  `;

  // Store last viewed index in session storage (temporary)
  try {
    sessionStorage.setItem("lastViewedIndex", String(randomIndex));
  } catch (e) {
    console.warn("sessionStorage not available:", e);
  }
}

// -----------------------------
// Event listener: Show New Quote button
// -----------------------------
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

// -----------------------------
// addQuote (required name)
// adds a new quote to the quotes array, updates localStorage and the DOM
// -----------------------------
function addQuote() {
  const textInputEl = document.getElementById("newQuoteText");
  const categoryInputEl = document.getElementById("newQuoteCategory");

  const textInput = textInputEl.value.trim();
  const categoryInput = categoryInputEl.value.trim();

  if (textInput === "" || categoryInput === "") {
    alert("Please fill both fields!");
    return;
  }

  // Add new quote to array
  quotes.push({
    text: textInput,
    category: categoryInput
  });

  // Persist to localStorage
  saveQuotesToStorage();

  // Clear inputs
  textInputEl.value = "";
  categoryInputEl.value = "";

  // Optional: show the newly added quote immediately
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p><strong>Quote added:</strong> ${textInput}</p>
    <p><strong>Category:</strong> ${categoryInput}</p>
  `;

  alert("Quote added successfully and saved to localStorage!");
}

// -----------------------------
// Session: show last viewed (optional helper)
document.getElementById("showLastViewed").addEventListener("click", function () {
  const last = sessionStorage.getItem("lastViewedIndex");
  if (last === null) {
    alert("No last viewed quote in this session.");
    return;
  }
  const idx = parseInt(last, 10);
  if (!Number.isFinite(idx) || idx < 0 || idx >= quotes.length) {
    alert("Last viewed quote not available (maybe quotes changed).");
    return;
  }
  const q = quotes[idx];
  document.getElementById("quoteDisplay").innerHTML = `
    <p><strong>Last viewed:</strong> ${q.text}</p>
    <p><strong>Category:</strong> ${q.category}</p>
  `;
});
// -----------------------------

// -----------------------------
// JSON Export: create and download a .json file with quotes
// -----------------------------
function exportToJson() {
  try {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();

    // cleanup
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert("Export failed: " + e.message);
  }
}

document.getElementById("exportJson").addEventListener("click", exportToJson);

// -----------------------------
// JSON Import: read uploaded file, validate and merge
// -----------------------------
function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    alert("No file selected.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (ev) {
    try {
      const imported = JSON.parse(ev.target.result);

      if (!Array.isArray(imported)) {
        alert("Invalid file format: expected an array of quote objects.");
        return;
      }

      // Validate shape of each imported item (must have text & category)
      const valid = imported.every(item =>
        item && typeof item.text === "string" && typeof item.category === "string"
      );

      if (!valid) {
        alert("Invalid file contents: each quote must have 'text' and 'category' string properties.");
        return;
      }

      // Merge imported quotes into our array
      quotes.push(...imported);

      // Save merged list to localStorage
      saveQuotesToStorage();

      alert("Quotes imported successfully and saved to localStorage!");
      // Optionally reset input so same file can be uploaded again if needed
      event.target.value = "";
    } catch (err) {
      console.error(err);
      alert("Failed to import JSON file. Make sure it's valid JSON.");
    }
  };

  reader.onerror = function () {
    alert("Failed to read file.");
  };

  reader.readAsText(file);
}

// -----------------------------
// On load: if there's a last viewed quote in session, show a subtle hint
// -----------------------------
(function showLastViewedHintOnLoad() {
  const last = sessionStorage.getItem("lastViewedIndex");
  if (last !== null) {
    // show a very small hint (non-blocking)
    const hint = document.createElement("div");
    hint.style.fontSize = "12px";
    hint.style.opacity = "0.9";
    hint.style.marginTop = "8px";
    hint.innerText = "Tip: You have a last viewed quote in this session. Click 'Show Last Viewed'.";
    document.getElementById("controls").appendChild(hint);
  }
})();
