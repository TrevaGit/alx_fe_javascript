// Default quotes or from localStorage
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

    // Reset dropdown
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    const uniqueCategories = [...new Set(quotes.map(q => q.category))];
    uniqueCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category
    categoryFilter.value = lastSelectedCategory;
}

// Function that filters quotes — required by assignment
function filterQuote() {
    const selectedCategory = document.getElementById('categoryFilter').value;

    // Save selected category to localStorage
    localStorage.setItem('lastSelectedCategory', selectedCategory);

    const container = document.getElementById('quotesContainer');
    container.innerHTML = '';

    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    filteredQuotes.forEach(q => {
        const quoteDiv = document.createElement('div');
        quoteDiv.className = 'quote';
        quoteDiv.innerHTML = `<p>${q.text}</p><p class="quote-category">Category: ${q.category}</p>`;
        container.appendChild(quoteDiv);
    });
}

// Add a new quote
function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();

    if (!text || !category) {
        alert('Please enter both quote text and category.');
        return;
    }

    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    filterQuote();

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
}

// Initialize app
populateCategories();
filterQuote();
