# -*- coding: utf-8 -*-
"""
LE DERNIER RÊVE
Un prototype minimaliste de fiction interactive.

Le principe : le joueur explore des souvenirs (des "scènes").
Chaque scène propose un choix : réparer le souvenir avec la
vérité, ou avec un joli mensonge. Le choix influence la fin.
"""

import time

# --- Les souvenirs sont stockés dans un dictionnaire simple ---
# Chaque clé est le nom du souvenir, chaque valeur contient
# le texte et les deux options possibles.

souvenirs = {
    "enfance": {
        "texte": "Un jardin d'été. Un ballon rouge qui s'envole. "
                 "Quelqu'un pleure, mais tu ne sais plus qui.",
        "verite": "C'était toi qui pleurais, parce que ton père venait de partir.",
        "mensonge": "C'était juste le vent qui faisait du bruit dans les feuilles."
    },
    "amour": {
        "texte": "Une gare. Une lettre jamais envoyée. Un train qui part sans toi.",
        "verite": "Tu n'as jamais eu le courage de la lui donner.",
        "mensonge": "Elle l'a lue, et elle a souri, quelque part, un jour."
    },
    "fin": {
        "texte": "Une porte blanche. De l'autre côté, plus rien... ou tout.",
        "verite": None,
        "mensonge": None
    }
}

# --- Le score moral : compte les vérités et les mensonges choisis ---
choix_verite = 0
choix_mensonge = 0


def afficher_lentement(texte):
    """Affiche le texte petit à petit pour un effet 'narratif'."""
    for mot in texte.split(" "):
        print(mot, end=" ", flush=True)
        time.sleep(0.05)
    print("\n")


def jouer_souvenir(nom):
    global choix_verite, choix_mensonge

    souvenir = souvenirs[nom]
    afficher_lentement(souvenir["texte"])

    if nom == "fin":
        return  # pas de choix pour la scène finale

    print("1. Lui offrir la vérité")
    print("2. Lui offrir un joli mensonge")
    choix = input("> ")

    if choix == "1":
        afficher_lentement(souvenir["verite"])
        choix_verite += 1
    else:
        afficher_lentement(souvenir["mensonge"])
        choix_mensonge += 1


def determiner_fin():
    """La fin dépend du nombre de vérités vs mensonges choisis."""
    if choix_verite > choix_mensonge:
        return "Il est parti avec ses souvenirs intacts, douloureux mais siens."
    elif choix_mensonge > choix_verite:
        return "Il est parti paisiblement, bercé par des rêves que tu as façonnés."
    else:
        return "Il est parti dans un entre-deux, ni tout à fait vrai, ni tout à fait faux."


def main():
    print("=== LE DERNIER RÊVE ===\n")
    afficher_lentement("Le temps presse. Reconstruis ses souvenirs, un par un.\n")

    jouer_souvenir("enfance")
    jouer_souvenir("amour")
    jouer_souvenir("fin")

    print("--- FIN ---")
    afficher_lentement(determiner_fin())


if __name__ == "__main__":
    main()