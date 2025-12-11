// Initialize quotes from localStorage or default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Don't watch the clock; do what it does. Keep going.", category: "Motivation" },
    { text: "Success usually comes to those who are too busy to be looking for it.", category: "Success" },
    { text: "Happiness is not something ready made. It comes from your own actions.", category: "Life" }
];

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';

    // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category
    categoryFilter.value = lastSelectedCategory;
}

// Function required by the assignment
function filterQuote() {
    const selectedCategory = document.getElementById('categoryFilter').value;

    // Save selected category to localStorage
    localStorage.setItem('lastSelectedCategory', selectedCategory);

    const container = document.getElementById('quotesContainer');
    container.innerHTML = '';

    // Filter quotes based on selection
    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    // Display quotes
    filteredQuotes.forEach(q => {
        const quoteDiv = document.createElement('div');
        quoteDiv.className = 'quote';
        quoteDiv.innerHTML = `<p>${q.text}</p><p class="quote-category">Category: ${q.category}</p>`;
        container.appendChild(quoteDiv);
    });
}

// Add a new quote
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (!text || !category) {
        alert('Please enter both quote text and category.');
        return;
    }

    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    filterQuote();

    textInput.value = '';
    categoryInput.value = '';
}

// Initial setup
populateCategories();
filterQuote();
