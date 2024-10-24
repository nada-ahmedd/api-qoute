let quotesHistory = [];

async function fetchQuoteById(id) {
    try {
        const response = await fetch(`https://dummyjson.com/quotes/${id}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const quote = await response.json();
        return quote; 
    } catch (error) {
        console.error("Error fetching quote:", error);
    }
}

async function displayRandomQuote() {
    const randomId = Math.ceil(Math.random() * 30);
    const quote = await fetchQuoteById(randomId);
    if (quote) {
        quotesHistory.push(quote);
        document.getElementById("quote").textContent = quote.quote; 
        document.getElementById("quote-id").textContent = `ID: ${quote.id}`; 
        checkFavoriteStatus(quote.quote); 
    }
}

async function displayPreviousQuote() {
    if (quotesHistory.length > 1) {
        quotesHistory.pop();
        const previousQuote = quotesHistory[quotesHistory.length - 1];
        document.getElementById("quote").textContent = previousQuote.quote; 
        document.getElementById("quote-id").textContent = `ID: ${previousQuote.id}`; 
        checkFavoriteStatus(previousQuote.quote); 
    }
}

function copyQuoteToClipboard() {
    const quoteText = document.getElementById("quote").textContent;
    navigator.clipboard.writeText(quoteText).then(() => {
        showMessage("Quote copied to clipboard!", "success");
        addQuoteToCopied(quoteText);
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}

let isFavorite = false;

function toggleFavorite() {
    const quoteText = document.getElementById("quote").textContent;
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
        const updatedFavorites = favorites.filter(fav => fav !== quoteText);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        showMessage("Quote removed from favorites!", "success");
        document.getElementById("favorite-icon").classList.remove("favorited");
    } else {
        favorites.push(quoteText);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        showMessage("Quote added to favorites!", "success");
        document.getElementById("favorite-icon").classList.add("favorited");
    }
    isFavorite = !isFavorite; 
    updateFavoritesList();
}

function checkFavoriteStatus(quote) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    isFavorite = favorites.includes(quote);
    const favoriteIcon = document.getElementById("favorite-icon");
    
    if (isFavorite) {
        favoriteIcon.classList.add("favorited");
    } else {
        favoriteIcon.classList.remove("favorited");
    }
}

function updateFavoritesList() {
    const favoritesList = document.getElementById("favorites-list");
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    favoritesList.innerHTML = favorites.length ? favorites.map(fav => `
        <div class="favorite-quote">
            ${fav}
        </div>`).join("") : "No favorite quotes.";
}

let copiedQuotes = [];

function addQuoteToCopied(quoteText) {
    if (!copiedQuotes.includes(quoteText)) {
        copiedQuotes.push(quoteText);
    }
}

function toggleFavorites() {
    const favoritesContent = document.getElementById("favorites-content");
    const copiedContent = document.getElementById("copied-content");

    copiedContent.style.display = "none";

    favoritesContent.style.display = favoritesContent.style.display === "none" ? "block" : "none";
    updateFavoritesList();
}

function toggleCopied() {
    const copiedContent = document.getElementById("copied-content");
    const favoritesContent = document.getElementById("favorites-content");

    favoritesContent.style.display = "none"; 

    copiedContent.style.display = copiedContent.style.display === "none" ? "block" : "none";
    const copiedList = document.getElementById("copied-list");
    copiedList.innerHTML = copiedQuotes.length ? copiedQuotes.map(quote => `
        <div class="copied-quote">
            ${quote}
            <button class="remove-copied" onclick="removeCopied('${quote}')">Remove</button>
        </div>`).join("") : "No copied quotes.";
}

function removeCopied(quoteText) {
    copiedQuotes = copiedQuotes.filter(quote => quote !== quoteText);
    showMessage("Copied quote removed!", "success");
    updateCopiedList();
}

function updateCopiedList() {
    const copiedList = document.getElementById("copied-list");
    copiedList.innerHTML = copiedQuotes.length ? copiedQuotes.map(quote => `
        <div class="copied-quote">
            ${quote}
            <button class="remove-copied" onclick="removeCopied('${quote}')">Remove</button>
        </div>`).join("") : "No copied quotes.";
}

function showMessage(message, type) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.className = type === "success" ? "message success" : "message warning";
    setTimeout(() => {
        messageDiv.textContent = '';
    }, 3000);
}

document.getElementById("copy-quote").onclick = copyQuoteToClipboard;
document.getElementById("reload-quote").onclick = displayRandomQuote;
document.getElementById("prev-quote").onclick = displayPreviousQuote;

document.addEventListener("DOMContentLoaded", () => {
    displayRandomQuote();
    document.getElementById("favorites-content").style.display = "none";
    document.getElementById("copied-content").style.display = "none";
});
