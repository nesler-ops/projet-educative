import unicodedata
import re
from pymongo import MongoClient

# Connexion à MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["educatif"]
collection = db["contenus"]

# Nettoyage préalable
collection.delete_many({})

# Fonction pour générer un slug
def slugify(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("utf-8")
    text = re.sub(r"[^\w\s-]", "", text).strip().lower()
    return re.sub(r"[\s_-]+", "-", text)

# Contenus du Plan A avec html_path
contenus = [
    # Français A1
    ("Salutations et présentations", "Apprends à saluer, te présenter et demander le nom.", "texte", "facile", "français", "<h2>Salutations</h2><p>Bonjour, comment tu t’appelles ?</p>"),
    ("Les jours, mois et saisons", "Découvre les jours de la semaine, les mois et les saisons.", "texte", "facile", "français", "<ul><li>Lundi</li><li>Mardi</li><li>Janvier</li><li>Hiver</li></ul>"),
    ("La famille", "Identifie les membres de la famille et parle de ta famille.", "texte", "facile", "français", "<p>Mon père, ma mère, mon frère, ma sœur.</p>"),

    # Français A2
    ("La routine quotidienne", "Exprime tes activités journalières avec des verbes pronominaux.", "texte", "moyen", "français", "<p>Je me lève à 7h. Je me brosse les dents.</p>"),
    ("Les loisirs et passe-temps", "Parle de tes loisirs et hobbies en français.", "texte", "moyen", "français", "<p>J’aime lire, dessiner et jouer au foot.</p>"),
    ("La nourriture et les repas", "Découvre le vocabulaire des aliments et comment commander.", "texte", "moyen", "français", "<p>Je prends du pain, du fromage et un café.</p>"),

    # Français B1
    ("Exprimer ses opinions", "Apprends à donner ton avis avec des expressions utiles.", "texte", "difficile", "français", "<p>À mon avis, je pense que...</p>"),
    ("Comparer et argumenter", "Utilise les comparatifs, superlatifs et mots de liaison.", "texte", "difficile", "français", "<p>Il est plus grand que moi. Pourtant, il est moins rapide.</p>"),
    ("Le passé composé vs imparfait", "Comprends la différence entre deux temps importants.", "texte", "difficile", "français", "<p>Hier, j’ai mangé. Quand j’étais petit, je mangeais...</p>"),

    # Mathématiques facile
    ("Les additions", "Introduction aux additions simples avec des exemples.", "exercice", "facile", "mathématiques", "<p>2 + 2 = 4, 5 + 3 = 8</p>"),
    ("Les soustractions", "Apprends à soustraire des nombres naturels.", "exercice", "facile", "mathématiques", "<p>7 - 2 = 5</p>"),
    ("Les multiplications", "Découvre les tables de multiplication.", "exercice", "facile", "mathématiques", "<p>3 × 4 = 12</p>"),

    # Mathématiques moyen
    ("Les divisions", "Introduction à la division posée.", "exercice", "moyen", "mathématiques", "<p>12 ÷ 3 = 4</p>"),
    ("Les fractions", "Comprends les fractions et leurs représentations.", "texte", "moyen", "mathématiques", "<p>1/2, 3/4, 5/8</p>"),
    ("Résolution d'équations", "Méthodes pour résoudre des équations simples.", "texte", "moyen", "mathématiques", "<p>x + 3 = 5 ⟶ x = 2</p>"),

    # Mathématiques difficile
    ("Les équations à deux inconnues", "Résous des systèmes d'équations.", "texte", "difficile", "mathématiques", "<p>x + y = 10, x - y = 2</p>"),
    ("Les puissances et racines", "Apprends les bases des exposants et racines carrées.", "texte", "difficile", "mathématiques", "<p>2² = 4, √9 = 3</p>"),
    ("Les pourcentages", "Calcule des augmentations, réductions et taxes.", "texte", "difficile", "mathématiques", "<p>20 % de 100 = 20</p>"),

    # Sciences facile
    ("Le cycle de l’eau", "Comprends le cycle naturel de l’eau.", "vidéo", "facile", "sciences", "<p>Évaporation → condensation → précipitation</p>"),
    ("Les 5 sens", "Découvre les cinq sens et leurs fonctions.", "texte", "facile", "sciences", "<ul><li>Vue</li><li>Ouïe</li><li>Toucher</li><li>Goût</li><li>Odorat</li></ul>"),
    ("Les plantes", "Structure et fonction des plantes.", "texte", "facile", "sciences", "<p>Racine, tige, feuille, fleur</p>"),

    # Sciences moyen
    ("Les états de la matière", "Solide, liquide, gaz : propriétés et changements.", "texte", "moyen", "sciences", "<p>L’eau peut être solide (glace), liquide ou gaz (vapeur).</p>"),
    ("Le système solaire", "Découvre les planètes et le soleil.", "texte", "moyen", "sciences", "<p>Soleil, Mercure, Vénus, Terre, Mars...</p>"),
    ("Les chaînes alimentaires", "Producteurs, consommateurs, décomposeurs.", "texte", "moyen", "sciences", "<p>Exemple : plante → lapin → renard</p>"),

    # Sciences difficile
    ("Le corps humain", "Systèmes digestif, circulatoire, respiratoire.", "texte", "difficile", "sciences", "<p>Le cœur, les poumons, l’estomac</p>"),
    ("L’électricité", "Circuits électriques simples.", "texte", "difficile", "sciences", "<p>Batterie, fils, ampoule, interrupteur</p>"),
    ("L’environnement et pollution", "Causes et conséquences de la pollution.", "texte", "difficile", "sciences", "<p>Pollution de l’air, de l’eau, des sols</p>")
]

# Insertion
for titre, description, type_, difficulte, matiere, html_path in contenus:
    slug = slugify(titre)
    doc = {
        "titre": titre,
        "description": description,
        "type": type_,
        "difficulte": difficulte,
        "matiere": matiere,
        "slug": slug,
        "html_path": html_path
    }
    collection.insert_one(doc)

print("✅ Données du Plan A insérées dans MongoDB.")
