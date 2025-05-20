// admin/modifier_article.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-modif-article");
    const articleIdInput = document.getElementById("articleId");
    const titreInput = document.getElementById("titre");
    const resumeInput = document.getElementById("resume");
    const descriptionInput = document.getElementById("description");
    const sourceInput = document.getElementById("source");
    const imageInput = document.getElementById("image");
    const previewImage = document.getElementById("preview-image");
    const currentImageInput = document.getElementById("currentImage");
    // const categorieSelect = document.getElementById("categorie"); // Si catégorie ajoutée

    // Mettre à jour l'année dans le footer
    const currentYearSpan = document.getElementById("currentYear");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    let articles = JSON.parse(localStorage.getItem("articles")) || [];
    let articleToEdit = null;

    // Récupérer l'ID de l'article depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const idToEdit = parseInt(urlParams.get('id'));

    if (idToEdit) {
        articleToEdit = articles.find(a => a.id === idToEdit);
    }

    if (articleToEdit) {
        articleIdInput.value = articleToEdit.id;
        titreInput.value = articleToEdit.titre;
        resumeInput.value = articleToEdit.resume;
        descriptionInput.value = articleToEdit.description;
        sourceInput.value = articleToEdit.source || "";
        // if (categorieSelect && articleToEdit.categorie) categorieSelect.value = articleToEdit.categorie; // Si catégorie

        if (articleToEdit.image) {
            previewImage.src = articleToEdit.image;
            previewImage.style.display = "block";
            currentImageInput.value = articleToEdit.image; // Stocker l'URL de l'image actuelle
        }
    } else {
        alert("Article non trouvé ! Redirection...");
        window.location.href = "admin.html";
    }

    if (imageInput && previewImage) {
        imageInput.addEventListener("change", function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = "block";
                }
                reader.readAsDataURL(file);
            } else { // Si l'utilisateur désélectionne un fichier, réafficher l'image actuelle si elle existe
                if (currentImageInput.value) {
                    previewImage.src = currentImageInput.value;
                    previewImage.style.display = "block";
                } else {
                    previewImage.src = "#";
                    previewImage.style.display = "none";
                }
            }
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!articleToEdit) return;

        const updatedArticleData = {
            id: articleToEdit.id,
            titre: titreInput.value,
            resume: resumeInput.value,
            description: descriptionInput.value,
            source: sourceInput.value,
            // categorie: categorieSelect ? categorieSelect.value : articleToEdit.categorie, // Si catégorie
            dateModification: new Date().toISOString() // Ajout date de modification
        };

        const processArticleUpdate = (newImageDataUrl = null) => {
            // Si une nouvelle image a été fournie, utiliser son URL.
            // Sinon, si une image actuelle existe et qu'aucune nouvelle image n'a été choisie, conserver l'image actuelle.
            // Sinon, pas d'image.
            if (newImageDataUrl) {
                updatedArticleData.image = newImageDataUrl;
            } else if (imageInput.files.length === 0 && currentImageInput.value) {
                updatedArticleData.image = currentImageInput.value;
            } else {
                updatedArticleData.image = null; // Si l'utilisateur a effacé l'image sans en mettre une nouvelle
            }


            const articleIndex = articles.findIndex(a => a.id === articleToEdit.id);
            if (articleIndex > -1) {
                articles[articleIndex] = { ...articles[articleIndex], ...updatedArticleData }; // Fusionner l'ancien et le nouveau
                localStorage.setItem("articles", JSON.stringify(articles));
                alert("Article mis à jour avec succès !");
                window.location.href = "admin.html"; // Rediriger vers la liste
            } else {
                alert("Erreur lors de la mise à jour de l'article.");
            }
        };

        const newImageFile = imageInput.files[0];
        if (newImageFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                processArticleUpdate(reader.result);
            };
            reader.readAsDataURL(newImageFile);
        } else {
            processArticleUpdate(null); // Pas de nouvelle image, processArticleUpdate gérera la conservation de l'ancienne
        }
    });
});