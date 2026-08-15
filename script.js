let nombre = document.getElementById("nombre");
let bouton = document.getElementById("calculer");
let reset = document.getElementById("reset");
let demo = document.getElementById("demo");
let aleatoire = document.getElementById("aleatoire");
let theme = document.getElementById("theme");

let resultat = document.getElementById("resultat");
let compteur = document.getElementById("compteur");

let historique = document.getElementById("historique");
let effacerHistorique =
    document.getElementById("effacerHistorique");

let totalCalculs =
    document.getElementById("totalCalculs");

let moyenneEtapes =
    document.getElementById("moyenneEtapes");

let recordEtapes =
    document.getElementById("recordEtapes");

let tests = document.getElementById("tests");
let testsResultat =
    document.getElementById("testsResultat");


// ================================
// DONNÉES
// ================================

let historiqueDonnees =
    JSON.parse(localStorage.getItem("kaprekarHistorique")) || [];

let statistiques =
    JSON.parse(localStorage.getItem("kaprekarStats")) || {
        total: 0,
        sommeEtapes: 0,
        record: 0
    };


// ================================
// CALCUL KAPREKAR
// ================================

function calculerKaprekar(valeur) {

    let nombreActuel = valeur;
    let etapes = [];

    if (nombreActuel === 6174) {
        return etapes;
    }

    while (nombreActuel !== 6174) {

        let chiffres = String(nombreActuel)
            .padStart(4, "0")
            .split("")
            .map(Number);

        chiffres.sort((a, b) => a - b);

        let ordre_croissant =
            chiffres[0] * 1000 +
            chiffres[1] * 100 +
            chiffres[2] * 10 +
            chiffres[3];

        let ordre_decroissant =
            chiffres[3] * 1000 +
            chiffres[2] * 100 +
            chiffres[1] * 10 +
            chiffres[0];

        let resultatSoustraction =
            ordre_decroissant - ordre_croissant;

        etapes.push({
            grand: String(ordre_decroissant).padStart(4, "0"),
            petit: String(ordre_croissant).padStart(4, "0"),
            resultat: String(resultatSoustraction).padStart(4, "0")
        });

        nombreActuel = resultatSoustraction;
    }

    return etapes;
}


// ================================
// VALIDATION
// ================================

function nombreValide(texte) {

    if (!/^\d{4}$/.test(texte)) {
        return false;
    }

    let chiffres = texte.split("");

    return !(
        chiffres[0] === chiffres[1] &&
        chiffres[1] === chiffres[2] &&
        chiffres[2] === chiffres[3]
    );
}


// ================================
// ANIMATION
// ================================

function afficherEtapes(etapes, index = 0) {

    if (index >= etapes.length) {

        let fin =
            document.createElement("div");

        fin.className = "fin";

        fin.textContent =
            "✓ La constante de Kaprekar est atteinte !!";

        resultat.appendChild(fin);

        return;
    }

    let etape = etapes[index];

    let bloc =
        document.createElement("div");

    bloc.className = "etape";

    bloc.innerHTML =
        "<strong>Etape" +
        (index + 1) +
        ":</strong> " +
        etape.grand +
        "-" +
        etape.petit +
        "=" +
        etape.resultat;

    resultat.appendChild(bloc);

    setTimeout(function() {
        afficherEtapes(etapes, index + 1);
    }, 250);
}


// ================================
// CALCUL
// ================================

bouton.addEventListener("click", function() {

    let texte = nombre.value.trim();

    resultat.innerHTML = "";
    compteur.textContent = "";

    if (!nombreValide(texte)) {

        resultat.innerHTML =
            "⚠️ Entre un nombre à 4 chiffres avec au moins 2 chiffres différents.";

        return;
    }

    let valeur = Number(texte);

    let etapes = calculerKaprekar(valeur);

    compteur.textContent =
        "🎯 " +
        etapes.length +
        " étape(s) pour atteindre 6174";

    if (etapes.length === 0) {

        resultat.innerHTML =
            '<div class="fin">' +
            "✓ 6174 est déjà la constante de Kaprekar !!" +
            "</div>";

    } else {

        afficherEtapes(etapes);
    }

    enregistrerStatistiques(
        texte,
        etapes.length
    );

    jouerSon();

});


// ================================
// DÉMONSTRATION
// ================================

demo.addEventListener("click", function() {

    nombre.value = "3524";

    bouton.click();

});


// ================================
// NOMBRE ALÉATOIRE
// ================================

aleatoire.addEventListener("click", function() {

    let valeur;

    do {

        valeur =
            Math.floor(
                1000 + Math.random() * 9000
            );

    } while (
        !nombreValide(String(valeur))
    );

    nombre.value = valeur;

    bouton.click();

});


// ================================
// RESET
// ================================

reset.addEventListener("click", function() {

    nombre.value = "";

    resultat.innerHTML = "";

    compteur.textContent = "";

    nombre.focus();

});


// ================================
// HISTORIQUE
// ================================

function enregistrerStatistiques(
    valeur,
    nombreEtapes
) {

    statistiques.total++;

    statistiques.sommeEtapes +=
        nombreEtapes;

    if (
        nombreEtapes >
        statistiques.record
    ) {

        statistiques.record =
            nombreEtapes;
    }

    localStorage.setItem(
        "kaprekarStats",
        JSON.stringify(statistiques)
    );


    historiqueDonnees.unshift({
        nombre: valeur,
        etapes: nombreEtapes,
        date: new Date().toLocaleTimeString()
    });

    historiqueDonnees =
        historiqueDonnees.slice(0, 10);

    localStorage.setItem(
        "kaprekarHistorique",
        JSON.stringify(historiqueDonnees)
    );

    afficherStatistiques();
    afficherHistorique();
}


function afficherStatistiques() {

    totalCalculs.textContent =
        statistiques.total;

    let moyenne = statistiques.total === 0
        ? 0
        : (
            statistiques.sommeEtapes /
            statistiques.total
        ).toFixed(1);

    moyenneEtapes.textContent =
        moyenne;

    recordEtapes.textContent =
        statistiques.record;
}


function afficherHistorique() {

    historique.innerHTML = "";

    if (historiqueDonnees.length === 0) {

        historique.innerHTML =
            "<p>Aucun calcul pour l'instant.</p>";

        return;
    }

    historiqueDonnees.forEach(function(item) {

        let ligne =
            document.createElement("div");

        ligne.className =
            "historique-item";

        ligne.innerHTML =
            "<strong>" +
            item.nombre +
            "</strong>" +
            " → " +
            item.etapes +
            " étape(s)" +
            "<small>" +
            item.date +
            "</small>";

        historique.appendChild(ligne);

    });
}


effacerHistorique.addEventListener(
    "click",
    function() {

        historiqueDonnees = [];

        statistiques = {
            total: 0,
            sommeEtapes: 0,
            record: 0
        };

        localStorage.removeItem(
            "kaprekarHistorique"
        );

        localStorage.removeItem(
            "kaprekarStats"
        );

        afficherHistorique();
        afficherStatistiques();
    }
);


// ================================
// MODE CLAIR / SOMBRE
// ================================

let mode =
    localStorage.getItem("kaprekarTheme") ||
    "sombre";

function appliquerTheme() {

    if (mode === "clair") {

        document.body.classList.add("clair");

        theme.textContent = "☀️";

    } else {

        document.body.classList.remove("clair");

        theme.textContent = "🌙";
    }
}

appliquerTheme();

theme.addEventListener(
    "click",
    function() {

        mode =
            mode === "sombre"
                ? "clair"
                : "sombre";

        localStorage.setItem(
            "kaprekarTheme",
            mode
        );

        appliquerTheme();
    }
);


// ================================
// SON
// ================================

function jouerSon() {

    try {

        let contexte =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        let oscillateur =
            contexte.createOscillator();

        let gain =
            contexte.createGain();

        oscillateur.frequency.value = 520;

        gain.gain.value = 0.05;

        oscillateur.connect(gain);

        gain.connect(
            contexte.destination
        );

        oscillateur.start();

        oscillateur.stop(
            contexte.currentTime + 0.08
        );

    } catch (erreur) {

        console.log(
            "Son non disponible."
        );
    }
}


// ================================
// TESTS AUTOMATIQUES
// ================================

tests.addEventListener(
    "click",
    function() {

        let cas = [
            "3524",
            "1234",
            "2025",
            "1000",
            "6174"
        ];

        let reussis = 0;

        let affichage = "";

        cas.forEach(function(nombreTest) {

            let etapes =
                calculerKaprekar(
                    Number(nombreTest)
                );

            let dernier =
                etapes.length === 0
                    ? Number(nombreTest)
                    : Number(
                        etapes[
                            etapes.length - 1
                        ].resultat
                    );

            if (dernier === 6174) {

                reussis++;

                affichage +=
                    "✅ " +
                    nombreTest +
                    " → OK<br>";

            } else {

                affichage +=
                    "❌ " +
                    nombreTest +
                    " → ERREUR<br>";
            }

        });

        affichage +=
            "<br><strong>" +
            reussis +
            "/" +
            cas.length +
            " tests réussis.</strong>";

        testsResultat.innerHTML =
            affichage;
    }
);


// ================================
// INITIALISATION
// ================================

afficherHistorique();
afficherStatistiques();


// ================================
// SERVICE WORKER
// ================================

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        function() {

            navigator.serviceWorker.register(
                "sw.js"
            ).catch(function(erreur) {

                console.log(
                    "Service Worker non disponible."
                );

            });

        }
    );
}
// ================================
// PARTAGE
// ================================

let partager = document.getElementById("partager");

partager.addEventListener("click", async function() {

    let lien = window.location.href;

    if (navigator.share) {

        try {

            await navigator.share({
                title: "Kaprekar 6174",
                text: "Découvre mon calculateur de la constante de Kaprekar 6174 !",
                url: lien
            });

        } catch (erreur) {

            console.log("Partage annulé.");

        }

    } else {

        try {

            await navigator.clipboard.writeText(lien);

            partager.textContent = "✅ Lien copié !";

            setTimeout(function() {
                partager.textContent = "📤 Partager";
            }, 2000);

        } catch (erreur) {

            alert("Impossible de copier le lien.");

        }
    }
});