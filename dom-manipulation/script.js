// --- Local Storage Helpers ---

// Save quotes array to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes from localStorage if available
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// --- INITIALIZE APP ---

let quotes = [
  { text: "Stay positive, work hard!", category: "Motivation" },
  { text: "Knowledge is power.", category: "Education" },
  { text: "Great things take time.", category: "Inspiration" }
];

// Load saved quotes first
loadQuotes();

// --- FUNCTIONS ---

// Show random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${quote.text}</p>
    <p><strong>Category:</strong> ${quote.category}</p>
  `;
}

// Event listener for "Show New Quote"
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Add new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText").value;
  const categoryInput = document.getElementById("newQuoteCategory").value;

  if (textInput === "" || categoryInput === "") {
    alert("Please fill both fields!");
    return;
  }

  // Add quote
  quotes.push({
    text: textInput,
    category: categoryInput
  });

  // Save to storage
  saveQuotes();

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added and saved!");
