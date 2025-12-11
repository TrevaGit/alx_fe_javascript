// Step 1: Our quotes array (each quote has text + category)
let quotes = [
  { text: "Stay positive, work hard!", category: "Motivation" },
  { text: "Knowledge is power.", category: "Education" },
  { text: "Great things take time.", category: "Inspiration" }
];

// Step 2: Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${quote.text}</p>
    <p><strong>Category:</strong> ${quote.category}</p>
  `;
}

// Step 3: Add event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Step 4: Function to add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText").value;
  const categoryInput = document.getElementById("newQuoteCategory").value;

  if (textInput === "" || categoryInput === "") {
    alert("Please fill both fields!");
    return;
  }

  // Add the new quote into the array
  quotes.push({
    text: textInput,
    category: categoryInput
  });

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}
