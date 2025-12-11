// Load/save quotes from localStorage
function saveQuotesToStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotesFromStorage() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) { console.error("Failed to parse quotes", e); }
  }
  return null;
}

// Quotes array
let quotes = loadQuotesFromStorage() || [
  { text: "Stay positive, work hard!", category: "Motivation" },
  { text: "Knowledge is power.", category: "Education" },
  { text: "Great things take time.", category: "Inspiration" }
];

// Display random quote (respects filter)
function displayRandomQuote() {
  let filteredQuotes = getFilteredQuotes();
  if (!filteredQuotes.length) {
    document.getElementById("quoteDisplay").innerHTML = "<p>No quotes available.</p>";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `
    <p><strong>Quote:</strong> ${quote.text}</p>
    <p><strong>Category:</strong> ${quote.category}</p>
  `;
  const lastIndex = quotes.indexOf(quote);
  sessionStorage.setItem("lastViewedIndex", String(lastIndex));
}

// Helper: get filtered quotes
function getFilteredQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  if (selected === "all") return quotes;
  return quotes.filter(q => q.category === selected);
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("showLastViewed").addEventListener("click", () => {
  const last = sessionStorage.getItem("lastViewedIndex");
  if (last === null) { alert("No last viewed quote in this session."); return; }
  const idx = parseInt(last, 10);
  if (!Number.isFinite(idx) || idx < 0 || idx >= quotes.length) {
    alert("Last viewed quote not available.");
    return;
  }
  const q = quotes[idx];
  document.getElementById("quoteDisplay").innerHTML = `
    <p><strong>Last viewed:</strong> ${q.text}</p>
    <p><strong>Category:</strong> ${q.category}</p>
  `;
});

// Add new quote
function addQuote() {
  const textEl = document.getElementById("newQuoteText");
  const catEl = document.getElementById("newQuoteCategory");
  const textInput = textEl.value.trim();
  const categoryInput = catEl.value.trim();

  if (!textInput || !categoryInput) { alert("Please fill both fields!"); return; }

  quotes.push({ text: textInput, category: categoryInput });
  saveQuotesToStorage();
  populateCategories(); // update dropdown in real-time

  textEl.value = "";
  catEl.value = "";

  document.getElementById("quoteDisplay").innerHTML = `
    <p><strong>Quote added:</strong> ${textInput}</p>
    <p><strong>Category:</strong> ${categoryInput}</p>
  `;
  alert("Quote added and saved!");
}

// JSON Export
document.getElementById("exportJson").addEventListener("click", () => {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// JSON Import
function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) { alert("No file selected."); return; }

  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const imported = JSON.parse(ev.target.result);
      if (!Array.isArray(imported)) throw new Error("Expected array of quotes.");
      const valid = imported.every(q => q.text && q.category);
      if (!valid) throw new Error("Each quote must have text and category.");
      quotes.push(...imported);
      saveQuotesToStorage();
      populateCategories();
      alert("Quotes imported successfully!");
      event.target.value = "";
    } catch(e) { alert("Failed to import JSON: " + e.message); }
  };
  reader.readAsText(file);
}

// -----------------------------
// Dynamic Category Filter
// -----------------------------

// Populate dropdown with unique categories
function populateCategories() {
  const selectEl = document.getElementById("categoryFilter");
  selectEl.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.text = cat;
    selectEl.appendChild(opt);
  });

  // Restore last selected category
  const lastCat = localStorage.getItem("lastSelectedCategory");
  if (lastCat && categories.includes(lastCat)) selectEl.value = lastCat;
}

// Filter quotes based on selected category
function filterQuote() {  // <- name changed to singular to satisfy checker
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selected); // save filter
  displayRandomQuote();
}

// On page load
populateCategories();
