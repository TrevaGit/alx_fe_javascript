document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.getElementById('quote-list');
    const notification = document.getElementById('notification');
    const categoryFilter = document.getElementById('category-filter');
    const localStorageKey = 'quotes';

    const initialQuotes = [
        { id: 1, text: "Believe in yourself!", category: "inspiration" },
        { id: 2, text: "Life is what happens when you're busy making other plans.", category: "life" },
        { id: 3, text: "Why don’t scientists trust atoms? Because they make up everything!", category: "funny" }
    ];

    // Load quotes from localStorage
    function loadLocalQuotes() {
        let quotes = JSON.parse(localStorage.getItem(localStorageKey));
        if (!quotes) {
            quotes = initialQuotes;
            saveLocalQuotes(quotes);
        }
        renderQuotes(quotes);
        return quotes;
    }

    // Save quotes to localStorage
    function saveLocalQuotes(quotes) {
        localStorage.setItem(localStorageKey, JSON.stringify(quotes));
    }

    // Render quotes in UI
    function renderQuotes(quotes) {
        const selectedCategory = categoryFilter.value;
        quoteList.innerHTML = '';
        quotes
            .filter(q => selectedCategory === 'all' || q.category === selectedCategory)
            .forEach(quote => {
                const li = document.createElement('li');
                li.textContent = quote.text;
                quoteList.appendChild(li);
            });
    }

    // Fetch quotes from server (mock API)
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
            const data = await response.json();
            return data.map(item => ({
                id: item.id,
                text: item.title,
                category: ["inspiration", "funny", "life"][Math.floor(Math.random() * 3)]
            }));
        } catch (error) {
            console.error('Error fetching quotes from server:', error);
            return [];
        }
    }

    // Post quotes to server (mock API)
    async function postQuotesToServer(quotes) {
        try {
            await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quotes)
            });
            // This is just simulation; no real server updates happen
        } catch (error) {
            console.error('Error posting quotes to server:', error);
        }
    }

    // Sync quotes with server and resolve conflicts
    async function syncQuotes() {
        const localQuotes = loadLocalQuotes();
        const serverQuotes = await fetchQuotesFromServer();

        // Merge with server precedence
        const mergedQuotes = [...serverQuotes];
        localQuotes.forEach(localQuote => {
            if (!serverQuotes.find(sq => sq.id === localQuote.id)) {
                mergedQuotes.push(localQuote);
            }
        });

        const prevLocal = JSON.stringify(localQuotes);
        const mergedString = JSON.stringify(mergedQuotes);

        if (prevLocal !== mergedString) {
            saveLocalQuotes(mergedQuotes);
            renderQuotes(mergedQuotes);
            showNotification('Quotes updated from server!');
            await postQuotesToServer(mergedQuotes); // optional: sync local changes to server
        }
    }

    // Show notification
    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => notification.style.display = 'none', 3000);
    }

    // Event listeners
    categoryFilter.addEventListener('change', () => {
        renderQuotes(loadLocalQuotes());
    });

    document.getElementById('sync-button').addEventListener('click', syncQuotes);

    // Initial load
    loadLocalQuotes();

    // Periodic sync every 15 seconds
    setInterval(syncQuotes, 15000);
});
