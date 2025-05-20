// js/index.js
document.addEventListener("DOMContentLoaded", () => {
    const articlesContainer = document.querySelector(".liste-articles");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const noArticlesMessage = document.querySelector(".no-articles");
    let allArticles = []; // Pour stocker tous les articles chargés initialement

    // Mettre à jour l'année dans le footer
    const currentYearSpan = document.getElementById("currentYear");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    function displayArticles(articlesToDisplay) {
        articlesContainer.innerHTML = ""; // Vider les articles existants

        if (!articlesToDisplay || articlesToDisplay.length === 0) {
            if (noArticlesMessage) noArticlesMessage.style.display = "block";
            return;
        }
        if (noArticlesMessage) noArticlesMessage.style.display = "none";

        articlesToDisplay.forEach(article => {
            const articleElement = document.createElement("article");
            articleElement.classList.add("article-resume");

            // Limiter la longueur du résumé
            const maxResumeLength = 150; // Nombre de caractères maximum pour le résumé
            const resumeText = article.resume.length > maxResumeLength
                             ? article.resume.substring(0, maxResumeLength) + "..."
                             : article.resume;

            articleElement.innerHTML = `
                <div class="image-article-wrapper">
                    ${article.image ? `<img src="${article.image}" alt="${article.titre}">` : '<div style="text-align:center; padding: 20px; color: #888;">Aucune image</div>'}
                </div>
                <div class="contenu-article-resume">
                    <h3>${article.titre}</h3>
                    <p>${resumeText}</p>
                    <a href="articles/article.html?id=${article.id}" class="lire-suite">Lire la suite <i class="fas fa-arrow-right"></i></a>
                </div>
            `;
            articlesContainer.appendChild(articleElement);
        });
    }

    function loadArticles() {
        const storedArticles = JSON.parse(localStorage.getItem("articles")) || [];
        allArticles = storedArticles; // Stocker pour la recherche
        displayArticles(allArticles);
    }

    function filterArticles() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredArticles = allArticles.filter(article =>
            article.titre.toLowerCase().includes(searchTerm) ||
            article.resume.toLowerCase().includes(searchTerm)
        );
        displayArticles(filteredArticles);
    }

    // Événements
    if (searchButton) {
        searchButton.addEventListener("click", filterArticles);
    }
    if (searchInput) {
        searchInput.addEventListener("keyup", (event) => {
            // Permet de chercher en appuyant sur Entrée ou en temps réel (après un délai)
            if (event.key === "Enter") {
                filterArticles();
            }
            // Pour une recherche en temps réel, on pourrait ajouter un debounce ici
        });
    }

    // Charger les articles au démarrage
    loadArticles();
});