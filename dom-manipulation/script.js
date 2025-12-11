// Quotes array
let quotes = [
  { text: "Stay positive, work hard!", category: "Motivation" },
  { text: "Knowledge is power.", category: "Education" },
  { text: "Great things take time.", category: "Inspiration" }
];

// Function to display a random quote (required name: displayRandomQuote)
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${quote.text}</p>
    <p><strong>Category:</strong> ${quote.category}</p>
  `;
}

// Event listener for the “Show New Quote” button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

// Function to add a new quote (required name: addQuote)
function addQuote() {
  const textInput = document.getElementById("newQuoteText").value;
  const categoryInput = document.getElementById("newQuoteCategory").value;

  if (textInput === "" || categoryInput === "") {
    alert("Please fill both fields!");
    return;
  }

  // Add new quote to the quotes array
  quotes.push({
    text: textInput,
    category: categoryInput
  });

  // Update the DOM (clear input fields)
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}
