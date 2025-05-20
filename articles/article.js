// articles/article.js
document.addEventListener("DOMContentLoaded", () => {
    const articleContentWrapper = document.getElementById("article-content-wrapper");
    const commentForm = document.getElementById("comment-form");
    const commentsListContainer = document.getElementById("comments-list-container");
    const noCommentsMessage = commentsListContainer.querySelector(".no-comments");
    const loadingPlaceholder = document.querySelector(".loading-placeholder");

    // Mettre à jour l'année dans le footer
    const currentYearSpan = document.getElementById("currentYear");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const articleId = parseInt(urlParams.get('id'));

    function formatDate(isoString) {
        if (!isoString) return 'Date inconnue';
        const date = new Date(isoString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    function loadArticle() {
        if (!articleId) {
            articleContentWrapper.innerHTML = "<p>ID d'article manquant ou invalide.</p>";
            if(loadingPlaceholder) loadingPlaceholder.style.display = 'none';
            return;
        }

        const articles = JSON.parse(localStorage.getItem("articles")) || [];
        const article = articles.find(a => a.id === articleId);

        if (loadingPlaceholder) loadingPlaceholder.style.display = 'none';

        if (article) {
            document.title = `${article.titre} - YZ-Blog`; // Met à jour le titre de la page

            let imageHtml = '';
            if (article.image) {
                imageHtml = `
                    <div class="article-image-container">
                        <img src="${article.image}" alt="${article.titre}">
                    </div>`;
            }
            // Vérifier si la description contient du HTML pour une vidéo (simpliste)
            // Pour une solution robuste, il faudrait un moyen de marquer les vidéos dans les données de l'article
            let descriptionHtml = article.description.replace(/\n/g, '<br>'); // Conserver les sauts de ligne
            if (descriptionHtml.includes("<iframe") || descriptionHtml.includes("<video")) {
                 // Si vous voulez envelopper les iframes/videos automatiquement:
                 // descriptionHtml = descriptionHtml.replace(/(<iframe.*?<\/iframe>|<video.*?<\/video>)/gs, '<div class="video-responsive-container">$1</div>');
            }


            articleContentWrapper.innerHTML = `
                <div class="article-header">
                    <h1>${article.titre}</h1>
                    <div class="article-meta">
                        <span><i class="fas fa-calendar-alt"></i> Publié le: ${formatDate(article.datePublication)}</span>
                        ${article.categorie ? `<span><i class="fas fa-tag"></i> Catégorie: ${article.categorie}</span>` : ''}
                    </div>
                </div>
                ${imageHtml}
                <div class="article-content">
                    ${descriptionHtml}
                </div>
                ${article.source ? `<p class="article-source"><strong>Source :</strong> <a href="${article.source}" target="_blank" rel="noopener noreferrer">${article.source}</a></p>` : ''}
            `;
            loadComments();
        } else {
            articleContentWrapper.innerHTML = "<p>Article non trouvé.</p>";
        }
    }

    function loadComments() {
        // Les commentaires sont stockés par articleId
        const allComments = JSON.parse(localStorage.getItem("comments")) || {};
        const articleComments = allComments[articleId] || [];

        commentsListContainer.querySelectorAll('.comment-item').forEach(item => item.remove()); // Vider anciens commentaires

        if (articleComments.length > 0) {
            if (noCommentsMessage) noCommentsMessage.style.display = "none";
            articleComments.forEach(comment => {
                const commentElement = document.createElement("div");
                commentElement.classList.add("comment-item");
                // Ne pas afficher l'email
                commentElement.innerHTML = `
                    <p class="comment-author">Anonyme <span class="comment-date">- ${formatDate(comment.date)}</span></p>
                    <p class="comment-body">${escapeHTML(comment.text)}</p>
                `;
                commentsListContainer.appendChild(commentElement);
            });
        } else {
            if (noCommentsMessage) noCommentsMessage.style.display = "block";
        }
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }


    if (commentForm) {
        commentForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const emailInput = document.getElementById("comment-email");
            const commentTextInput = document.getElementById("comment-text");

            const email = emailInput.value;
            const text = commentTextInput.value;

            // Validation simple de l'email (HTML5 type="email" fait déjà une partie)
            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                alert("Veuillez entrer une adresse email valide.");
                emailInput.focus();
                return;
            }

            if (!text.trim()) {
                alert("Veuillez écrire votre commentaire.");
                commentTextInput.focus();
                return;
            }

            const newComment = {
                email: email, // Stocké mais non affiché publiquement par défaut
                text: text,
                date: new Date().toISOString()
            };

            let allComments = JSON.parse(localStorage.getItem("comments")) || {};
            if (!allComments[articleId]) {
                allComments[articleId] = [];
            }
            allComments[articleId].push(newComment);
            localStorage.setItem("comments", JSON.stringify(allComments));

            loadComments(); // Recharger et afficher la liste des commentaires
            commentForm.reset(); // Vider le formulaire
            alert("Commentaire soumis avec succès !");
        });
    }

    // Charger l'article au démarrage
    loadArticle();
});