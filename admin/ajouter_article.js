// admin/ajouter_article.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-ajout-article");
    const imageInput = document.getElementById("image");
    const previewImage = document.getElementById("preview-image");

    // Mettre à jour l'année dans le footer
    const currentYearSpan = document.getElementById("currentYear");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
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
            } else {
                previewImage.src = "#";
                previewImage.style.display = "none";
            }
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const titre = document.getElementById("titre").value;
        const resume = document.getElementById("resume").value;
        const description = document.getElementById("description").value;
        const source = document.getElementById("source").value;
        const imageFile = imageInput.files[0];
        // const categorie = document.getElementById("categorie") ? document.getElementById("categorie").value : "autre"; // Si catégorie ajoutée

        let articles = JSON.parse(localStorage.getItem("articles")) || [];

        const processArticleAdd = (imageDataUrl = null) => {
            const nouvelArticle = {
                id: Date.now(), // Génère un ID unique basé sur le timestamp
                titre: titre,
                resume: resume,
                description: description,
                source: source,
                image: imageDataUrl,
                // categorie: categorie, // Si catégorie ajoutée
                datePublication: new Date().toISOString() // Ajout de la date de publication
            };

            articles.push(nouvelArticle);
            localStorage.setItem("articles", JSON.stringify(articles));

            alert("Article ajouté avec succès !");
            form.reset();
            if(previewImage) {
                previewImage.src = "#";
                previewImage.style.display = "none";
            }
            // Rediriger vers admin.html
             window.location.href = "admin.html";
        };

        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                processArticleAdd(reader.result); // reader.result contient l'URL base64 de l'image
            };
            reader.readAsDataURL(imageFile);
        } else {
            processArticleAdd(null); // Pas d'image
        }
    });
});