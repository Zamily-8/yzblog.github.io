// admin/admin.js
document.addEventListener("DOMContentLoaded", () => {
    // Commentaire : Sélection des éléments du DOM
    const tbody = document.querySelector("#tableau-articles tbody");
    const noArticlesAdminMessage = document.getElementById("no-articles-admin");
    let articles = JSON.parse(localStorage.getItem("articles")) || [];

    // Commentaire : Mettre à jour l'année dans le footer [cite: 39]
    const currentYearSpan = document.getElementById("currentYear");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Commentaire : Fonction pour tronquer le texte si trop long
    const truncateText = (text, maxLength = 50) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    // Commentaire : Fonction pour afficher les articles dans le tableau
    function renderArticles() {
        tbody.innerHTML = ""; // Vider le tableau [cite: 41]

        // Commentaire : Gérer le cas où il n'y a pas d'articles
        if (articles.length === 0) {
            if (noArticlesAdminMessage) noArticlesAdminMessage.style.display = "block";
            return; // [cite: 42]
        }
        if (noArticlesAdminMessage) noArticlesAdminMessage.style.display = "none";

        // Commentaire : Parcourir chaque article et créer une ligne dans le tableau
        articles.forEach(article => { // [cite: 43]
            const tr = document.createElement("tr");
            tr.setAttribute('data-id', article.id); // Utile pour retrouver la ligne

            // Commentaire : MODIFICATION pour utiliser les icônes locales [cite: 7]
            // Assurez-vous d'avoir les images edit-icon.png (ou .svg) et delete-icon.png (ou .svg)
            // dans le dossier YZ Blog/images/icons/
            tr.innerHTML = `
                <td>${article.titre || 'N/A'}</td>
                <td>${truncateText(article.resume)}</td>
                <td>${truncateText(article.source, 30)}</td> <td class="actions">
                    <button class="btn btn-primary btn-sm edit-btn" data-id="${article.id}" title="Modifier">
                        <img src="../images/icons/edit-icon.png" alt="Modifier" class="icon-local"> Modifier
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${article.id}" title="Supprimer">
                        <img src="../images/icons/delete-icon.png" alt="Supprimer" class="icon-local"> Supprimer
                    </button>
                </td>
            `;
            // Fin de la modification pour les icônes locales

            tbody.appendChild(tr); // [cite: 46]
        });

        attachEventListeners(); // Attacher les écouteurs d'événements aux nouveaux boutons [cite: 47]
    }

    // Commentaire : Fonction pour attacher les écouteurs d'événements aux boutons modifier/supprimer
    function attachEventListeners() {
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                const articleId = e.currentTarget.dataset.id;
                // Commentaire : Rediriger vers la page de modification avec l'ID de l'article
                window.location.href = `modifier_article.html?id=${articleId}`; // [cite: 48]
            });
        });

        document.querySelectorAll(".delete-btn").forEach(button => { // [cite: 49]
            button.addEventListener("click", (e) => {
                const articleId = parseInt(e.currentTarget.dataset.id); // Convertir l'ID en nombre
                // Commentaire : Demander confirmation avant suppression
                if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
                    deleteArticle(articleId);
                }
            }); // [cite: 50]
        });
    }

    // Commentaire : Fonction pour supprimer un article
    function deleteArticle(id) { // [cite: 51]
        articles = articles.filter(a => a.id !== id); // Filtrer l'article à supprimer
        localStorage.setItem("articles", JSON.stringify(articles)); // Mettre à jour le localStorage [cite: 52]
        renderArticles(); // Re-afficher la table
        // Commentaire : Notification de succès (simple alerte)
        alert("Article supprimé avec succès !"); // [cite: 53]
    }

    // Commentaire : Affichage initial des articles
    renderArticles();
    // Commentaire : Le formulaire d'ajout est maintenant sur sa propre page (ajouter_article.html). [cite: 54, 55]
});
