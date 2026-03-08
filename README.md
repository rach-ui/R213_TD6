# ImmoPlus — Agence Immobilière

Projet réalisé avec **Astro** et **PocketBase**.

## Pages

- `/` — Accueil
- `/offres` — Liste des offres immobilières avec filtres
- `/offres/[id]` — Détail d'une offre
- `/offres/add` — Ajouter une offre
- `/offres/surface` — Offres avec surface > 50m²
- `/offres/prix` — Offres à moins de 100 000 €
- `/agents` — Liste des agents
- `/agents/[id]` — Offres d'un agent
- `/about` — À propos

## Stack technique

- **Astro** v5
- **TailwindCSS** v4
- **PocketBase** (base de données et stockage des images)

## Lancer le projet

```bash
npm install
npm run dev
```

PocketBase doit tourner sur `http://127.0.0.1:8090`.

---

# TD 1

**Objectif**: Au cours des TDs, nous allons développer un site web pour un conservatoire tout en pratiquant Astro.

1. Commencez par l'installation : [Guide d'installation Astro](https://docs.astro.build/fr/install-and-setup/)

2. Installez Tailwind avec la commande : 
    ```sh
    npx astro add tailwind
    ```

3. Installez l'adaptateur Netlify pour que le site puisse être déployé sur Netlify avec la commande (https://docs.astro.build/fr/guides/integrations-guide/netlify/):
    ```sh
    npx astro add netlify
    ```

4. Supprimez tous les fichiers `.astro` sauf `index.astro`.

5. Créez un nouveau layout contenant un composant header et footer, ainsi qu'un contenu entre les deux.

6. Passez le titre de la page en tant que props au layout.

7. Créez un menu dans le header et un message dans le footer.

# TD 2

**Objectif**: L'objectif de ce TD est d'afficher une liste de données, dans notre site ce sera la liste des événements dans l'agenda du conservatoire :

1. Créez la page `pages/agenda.astro`.

2. Ajoutez la page dans le menu de navigation dans `components/Header.astro`.

3. Ajoutez la liste des événements suivante dans le frontmatter de `agenda.astro` :
```js
const events = [
    {
        title: "Conférence sur les astres",
        date: "Lundi 12 Juillet",
        favori: true,
    },
    {
        title: "Atelier sur les étoiles",
        date: "Mardi 13 Juillet",
        favori: false,
    },
];
```

4. Affichez la liste des événements en utilisant la fonction `events.map` dans des composants Card.
```js
{
    events.map((event) => (
        <ul>
            <li>{event.title} - {event.date}</li>
        </ul>
    ))
}
```
   
5.  Créez le composant `EventCard.astro`.

```js
---
const { event } = Astro.props;
---

<div
    class="border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
>
    <div class="flex items-center gap-2 mb-2">
        <strong class="text-lg">{event.title}</strong>
    </div>
    <p class="text-gray-600 text-sm mb-4">{event.date}</p>
    <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors">
        Favori
    </button>
</div>
```
6. Changez la couleur de fond de la carte selon que l’événement est favori ou non, en utilisant les classes Tailwind.

```html
<div class={`event-card border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer ${event.favori ? 'bg-yellow-100' : 'bg-white'}`}>
```
   
7. En utilisant un script `JavaScript`, changez la couleur de fond de la carte selon que l’événement soit favori ou non.
```js
<div
    class="event-card border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
    data-favori={event.favori}
>
    <div class="flex items-center gap-2 mb-2">
        <strong class="text-lg">{event.title}</strong>
    </div>
    <p class="text-gray-600 text-sm mb-4">{event.date}</p>
    <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors">
        Favori
    </button>
</div>


<script>
    //@ts-nocheck
    const cards = document.querySelectorAll('.event-card');
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const isFavori = card.dataset.favori === 'true';
            card.dataset.favori = isFavori ? 'false' : 'true';
            console.log(card.dataset.favori);
            card.classList.toggle('bg-yellow-100');
            card.classList.toggle('bg-white');
        });
    });
    
</script>

```

# TD 3

**Objectifs**:
- Afficher une liste de données dynamiques provenant d'une base de données.
- Formater une date en JavaScript.
- Utiliser des modules JavaScript.

1. Installez le paquet `pocketbase` pour pouvoir se connecter à la base de données et utiliser l'API PocketBase en exécutant la commande : `npm install pocketbase`.
2. Créez le fichier `backend.mjs` dans le dossier `src/js`. Ce fichier est un module JavaScript qui gère les communications avec PocketBase.
3. Comme vu dans le module R214, créez une instance de `PocketBase` :
    ```js
    import PocketBase from "pocketbase";
    const pb = new PocketBase("http://127.0.0.1:8090");
    ```

    > La constante `pb` contient une instance de la classe `PocketBase`. Elle peut maintenant être utilisée pour interagir avec le serveur PocketBase et effectuer des opérations CRUD (Create, Read, Update, Delete).

4. Écrivez la fonction vue dans le module R214 pour récupérer la liste des événements dans `backend.mjs`:
```js
export async function getEvents() {
    const today = new Date().toISOString();
    let events = await pb.collection("events").getFullList(
        {
            sort: "-date",
            order: "desc",
            filter: `date >= "${today}"`,
        }
    );
    return events;
}
```

5. Pour formater la date, utilisez la classe `Date` en JavaScript. Par exemple :
```js
const eventDate = new Date(event.date);
const formattedDate = eventDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
});
event.formattedDate = formattedDate;
```

6. Affichez la liste des événements provenant de `PocketBase` au lieu de la liste statique utilisée au TD précédent.
<!-- 5. Afin de récupérer les images, PocketBase utilise un système de stockage de fichiers. Vous pouvez accéder aux images en utilisant l'URL sauvegardée dans la collection avec la fonction `pb.files.getURL(record, url)`. -->
<!-- 6. Pour chaque élément dans la liste récupérée d'événements, ajoutez une propriété contenant l'URL de l'image :
```js
events.forEach((event) => {
    event.img = pb.files.getURL(event, event.imgUrl);
});
``` -->

7. Afin de récupérer les images, PocketBase utilise un système de stockage de fichiers. Vous pouvez accéder aux images en utilisant l'URL sauvegardée dans la collection avec la fonction `pb.files.getURL(record, url)`. Dans le fichier backend ajouter la fonction suivante qui récupère l'url de vos images depuis pocketbase:

```js
export async function getImageUrl(record, imageField) {
    return pb.files.getURL(record, record[imageField]);
}
```

8. Créez le composant `PbImage.astro` pour afficher les image. Il utilise la fonction `getImageURL` définie dans `backend.mjs`:
```js
---
import { getImageUrl } from '../js/backend.mjs';
import { Image } from "astro:assets";

const { record, imageField } = Astro.props;

const imageURL = await getImageUrl(record, imageField);
---

{imageURL && 
    <Image
        src={imageURL}
        alt={record.nomMaison || 'Image'}
        inferSize={true}
    />
}

```

9. Affichez les images en utilisant le composant `PbImage` dans le composant `EventCard`.


# TD 4

L'objectif de ce TD est de créer des pages dynamiques paramétrées pour afficher les détails de chaque événement en utilisant des paramètres dans les URL. Cela permet de générer des pages uniques pour chaque événement sans avoir à créer manuellement chaque page. (Voir: [Astro doc: Routing](https://docs.astro.build/en/guides/routing/))

- Créez le dossier `agenda` dans `src/pages`.
  
- Déplacez le fichier `agenda.astro` dans le dossier `src/pages/agenda` et renommez-le `index.astro`.
  
- Vérifiez que la route `/agenda` fonctionne toujours.
  
- Dans `src/pages/agenda`, ajoutez le fichier `[id].astro`. Ce fichier est utilisé pour créer des pages dynamiques dans le projet Astro. Le `[id]` représente un paramètre dynamique qui permet de générer des pages basées sur des identifiants spécifiques.

- Dans le composant `Card`, ajoutez un lien vers cette page dynamique:
    ```html
    <a href=`agenda/${event.id}`> Plus d'info </a>
    ```

- Vous pouvez récupérer la valeur de l'id dans la page dynamique `[id].astro` en utilisant `Astro.params`:
    ```js
    const { id } = Astro.params;
    ```

- Ajoutez dans `backend.js` une fonction qui permet de récupérer les données d'un seul événement en prenant en paramètre son id. La fonction doit retourner `null` si l'id n'existe pas dans la base de données.

- Utilisez cette fonction dans `[id].astro` pour récupérer les données de l'événement ayant comme id la valeur passée en paramètre.

- Affichez les détails de l'événement dans le fichier `[id].astro`. Le composant `Card` doit afficher uniquement le titre et l'image.

- Ajoutez une page `404.astro` dans `src/pages`.

- Dans le frontmatter de `[id].astro` ajoutez la redirection vers la route `/agenda` si l'id n'existe pas dans la base de données:
    ```js
    if (!event) {
        console.error(`Event with id ${id} not found`);
        return Astro.redirect("/agenda");
    }
    ```

- Ajoutez un champ boolean `favori` dans la collection d'événements dans PocketBase.

- Créez un nouveau fichier `js/utils.mjs`. Ce fichier est un module comme `backend.mjs` mais il contiendra des fonctions qu'on peut utiliser dans toutes les pages mais qui ne servent pas à interagir avec la base de données. Par exemple, il peut contenir la fonction suivante qui permet de formater une date:
```js
export function formatDate (date) {
    // Formater la date en français
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const DateString = new Date(date).toLocaleDateString('fr-FR', options);
    return DateString;
}
```
- Utilisez la fonction pour formater la date provenant de la base de données. On peut le faire dans la fonction `getEvents()`.

Dans la suite, nous allons faire persister le changement de la valeur de favori en utilisant `javascript`.

- Si ce n'est pas encore fait, modifiez le composant `EventCard` pour changer la couleur du fond en fonction de la valeur de favori. Par exemple:
```js
<script>
    //@ts-nocheck
    const cards = document.querySelectorAll('.event-card');
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const isFavori = card.dataset.favori === 'true';
            card.dataset.favori = isFavori ? 'false' : 'true';
            console.log(card.dataset.favori);
            card.classList.toggle('bg-yellow-100');
            card.classList.toggle('bg-white');
        });
    });
    
</script>
```

- Ajoutez une fonction dans `backend.mjs` qui permet de modifier la valeur de favori dans la base de données:
```js
export async function setFavoriteEvent(id, valeurFavori) {
    try {
        console.log("id", id, "valeurFavori", valeurFavori);
        await pb.collection("events").update(id, { favori: valeurFavori });
        return true;
    } catch (error) {
        console.log("error", error);
        return false;
    }
}
```

Pour persister le favori côté client (comme dans `EventCard.astro`), utilisez un script JavaScript qui :
- lit `data-favori` et `data-eventId`,
- met à jour la classe de la carte,
- appelle `setFavoriteEvent`.

```js
<script>
    //@ts-nocheck
    import { setFavoriteEvent } from "../js/backend.mjs";
    const cards = document.querySelectorAll('.event-card');
    cards.forEach((card) => {
        card.addEventListener('click', async () => {
            const isFavori = card.dataset.favori === 'true';
            const newFavoriStatus = !isFavori;
            card.setAttribute('data-favori', newFavoriStatus.toString());
            if (newFavoriStatus) {
                card.classList.add('bg-yellow-100');
            } else {
                card.classList.remove('bg-yellow-100');
            }
            const eventId = card.dataset.eventId;
            await setFavoriteEvent(eventId, newFavoriStatus);
        });
    });
</script>
```

> La fonction `setFavoriteEvent` sera appelée depuis le navigateur et non pas comme d'habitude sur le serveur durant le rendu de la page. Cela permettra d'interagir avec la base de données une fois qu'une interaction côté client est faite.

# TD 5
L'objectif de ce TD est de créer des formulaires pour gérer les entrées utilisateur et les communiquer avec PocketBase.
Pour plus d'informations sur les formulaires HTML, consultez : [MDN Web Docs: Your first form](https://developer.mozilla.org/en-US/docs/Learn/Forms/Your_first_form).

Nous allons commencer par créer une page contenant un formulaire permettant d'ajouter un événement dans la base de données.

- Créez la page `add.astro` dans le dossier `agenda`. Cette page contiendra un formulaire permettant à l'utilisateur de saisir les données d'un événement :
```js
---
import Layout from "../../layouts/Layout.astro";
---

<Layout title="Ajouter un événement">
    <h1 class="text-3xl">Ajouter un événement</h1>
    <form class="flex flex-col p-4">
        <input type="text" name="title" placeholder="Titre" class="border my-4 p-2 rounded-md" />
        <select name="categorie" class="border my-4 p-2">
            <option value="Théâtre">Théâtre</option>
            <option value="Musique">Musique</option>
        </select>
        <input type="text" name="excerpt" placeholder="Extrait" class="border my-4 p-2 rounded-md" />
        <select name="lieu" class="border my-4 p-2">
            <option value="Théâtre">Théâtre</option>
            <option value="Conservatoire">Conservatoire</option>
        </select>
        <textarea name="description" placeholder="Description" class="border my-4 p-2 rounded-md"></textarea>
        <input type="date" name="date" class="border my-4 p-2 rounded-md" />
        <input type="file" name="imgUrl" class="border my-4 p-2 rounded-md" />
        <input type="submit" value="Ajouter" class="bg-slate-500 rounded-lg p-5" />
    </form>
</Layout>
```

> Attention : l'attribut `name` dans les balises `<input/>` doit correspondre au nom du champ dans la collection de votre base de données.

- Ajoutez un lien dans la page `agenda/index.astro` menant à la nouvelle page contenant le formulaire :
```html
<a href="/agenda/add" class="text-blue-800 underline">Ajouter un événement</a>
```

- Vérifiez l'affichage.
- Ajoutez les attributs suivants dans la balise `<form>` de la page `agenda/add.astro` :
```html
<form
    class="flex flex-col p-4"
    action="/agenda/add" 
    method="post"  
    enctype="multipart/form-data"
>
<!--
action="/agenda/add" : Spécifie la route où les données du formulaire seront envoyées.
method="post" : Définit la méthode HTTP utilisée pour envoyer les données du formulaire.
enctype="multipart/form-data" : Indique que le formulaire peut envoyer des fichiers (pour les images).
-->
```

- Dans le fichier `backend.mjs`, ajoutez la fonction qui crée un nouvel enregistrement dans votre collection :
```js
/**
 * Ajoute un événement à la collection "events".
 * @param {Object} data - Les données de l'événement à ajouter.
 * @returns Un objet contenant le statut de l'opération et un message.
 */
export async function addEvent(data) {
    try {
        await pb.collection("events").create(data);
        return {
            success: true,
            message: "L'événement a été ajouté avec succès.",
        };
    } catch (error) {
        return {
            success: false,
            message: "Une erreur est survenue lors de l'ajout de l'événement : " + error,
        };
    }
}
```

- Dans le frontmatter de la page `add.astro`, traitez les données si la requête est de type `POST` et appelez la fonction `addEvent` pour créer un nouvel enregistrement :
```js
let pbMessage = ""; // Initialisation de la variable pour stocker le message de retour

if (Astro.request.method === "POST") { // Vérifie si la méthode de la requête est POST
    const data = await Astro.request.formData(); // Récupère les données du formulaire de la requête
    console.log(data); // Affiche les données du formulaire dans la console

    const eventDate = new Date(data.get("date")?.toString() || new Date()); // Convertit la date du formulaire en objet Date, ou utilise la date actuelle si non spécifiée

    if (eventDate < new Date()) { // Vérifie si la date de l'événement est dans le passé
        pbMessage = "La date doit être dans le futur"; // Définit le message d'erreur si la date est dans le passé
    } else {
        const resp = await addEvent(data); // Appelle la fonction addEvent avec les données du formulaire et attend la réponse
        pbMessage = resp.message; // Définit le message de retour avec le message de la réponse
    }
}
```

- Ajoutez l'affichage de `pbMessage` pour afficher le message de retour :
```html
<p>{pbMessage}</p>
```

- Vérifiez le fonctionnement en vous assurant qu'un nouvel enregistrement a été ajouté dans la base de données.

---
Dans la suite, nous allons utiliser un formulaire dans `agenda/index.astro` pour filtrer les événements par catégorie.

- Définissez la liste des catégories dans le frontmatter :
```js
const categories = ['Tout', 'Théâtre', 'Musique']; // Cette liste doit contenir toutes les catégories exactement comme elles sont définies dans PocketBase.
console.log(categories);
```

> Vous pouvez aussi utiliser une liste dynamique :
```js 
const categories = ['Tout', ...new Set(events.map((event) => event.categorie))]; // Retourne une liste de catégories d'événements sans doublons.
```

- Ajoutez un formulaire qui utilise la balise `<select>` pour choisir la catégorie :
```html
<form action="/agenda" method="post">
    <label for="categorie">Filtrer par catégorie :</label>
    <select name="categorie">
        {
            // Parcourir la liste de catégories et afficher chaque catégorie dans une balise <option>
            categories.map((categorie) => (
                <option value={categorie}>{categorie}</option>
            ))
        }
    </select>
    <input type="submit" value="Filtrer" />
    <br /><br />
</form>
```

- Dans le frontmatter, ajoutez la gestion du formulaire pour filtrer les événements en fonction de la catégorie sélectionnée :
```js
let events = await getEvents();
let categories = ["Tout", ...new Set(events.map((e) => e.categorie))];
console.log(events);
if(Astro.request.method === 'POST') {
    const data = await Astro.request.formData();
    const selectedCategory = data.get('categorie');
    if(selectedCategory && selectedCategory !== 'Tout') {
        // La méthode filter() crée un nouveau tableau avec uniquement les éléments
        // pour lesquels la condition retourne true.
        events = events.filter(e => e.categorie === selectedCategory);
        categories = [selectedCategory, ...categories.filter(c => c !== selectedCategory)];
    }
}
```

# TD 6

**Objectif**: Créer une nouvelle page pour afficher les artistes et une route dynamique pour afficher la liste des événements par artiste. Le deuxième objectif est de créer un formulaire pour modifier les données des événements.

- Créez le dossier `artistes` dans `src/pages` puis le fichier `index.astro` dans `src/pages/artistes`.
  
- Dans la page `index.astro`, affichez la liste des artistes. Utilisez la fonction vue dans le module R214.
  
- Ajoutez une route dynamique `artistes/[id].astro` pour afficher la liste des événements de chaque artiste.

Ensuite, nous allons créer un formulaire pour modifier les données de la collection d'événements.

- Créez la route dynamique `agenda/modify/[id].astro` qui permet de modifier un événement dans PocketBase. Cette page doit contenir le même formulaire que celui de la page `add.astro`.

- Dans le frontmatter, récupérez les données de l'événement ayant comme id la valeur passée en paramètre :
    ```js
    const { id } = Astro.params;
    let event = await getOneEvent(id);
    if (!event) {
        console.error(`Event with id ${id} not found`);
        return Astro.redirect("/agenda");
    }
    ```

    ```js
    //backend.mjs
    export async function getOneEvent(id) {
        try {
            const event = await pb.collection("events").getOne(id);
            event.img = pb.files.getURL(event, event.imgUrl);
            event.formattedDate = formatDate(event.date);
            return event;
        } catch (error) {
            return null;
        }
    }
    ```

- Pour chaque balise `input` ou `select` du formulaire, définissez la valeur de l'attribut `value` comme celle de `event`. Par exemple :
    ```html
    <input type="text" name="title" placeholder="Titre" class="border my-4 p-2 rounded-md" value={event?.title} required/>
    ```

- Afin de pouvoir afficher, sélectionner et modifier l'artiste associé à l'événement, récupérez la liste des artistes. Ajoutez dans le frontmatter :
    ```js
    const artists = await allArtists();
    ```

    ```js
    //backend.mjs
    export async function allArtists() {
        try {
            let artists = await pb.collection("artists").getFullList();
            return artists
        } catch (error) {
            console.error("error allArtists: ", error);
            return null;
        }
    }
    ```

- Dans le formulaire, ajoutez la balise `select` qui permet de modifier l'artiste :
    ```html
    <select name="artist" class="border my-4 p-2">
        {
            artists?.map((artist) => (
                <option value={artist.id} selected={event.artist == artist.id}>{artist.first_name} {artist.last_name}</option>
            ))
        }
    </select>
    ```

- Traitez les données envoyées pour modifier l'événement dans PocketBase :
    ```js
    if (Astro.request.method == "POST") {
        const data = await Astro.request.formData();
        console.log(data);
        if (new Date(data.get("date")?.toString() || 0) < new Date()) {
            pbMessage = "La date de l'événement doit être supérieure à la date d'aujourd'hui";
        } else {
            const response = await updateEvent(event.id, data);
            event = response.event;
            if (!event) {
                console.error(`Event with id ${id} not found`);
                return Astro.redirect("/agenda");
            }
            pbMessage = response.message;
        }
    }
    ```

    ```js
    export async function updateEvent(id, data) {
        try {
            const event = await pb.collection("events").update(id, data);
            return {
                success: true,
                event: event,
                message: "L'événement a été modifié avec succès.",
            };
        } catch (error) {
            return {
                success: false,
                event: null,
                message: "Une erreur est survenue lors de la modification de l'événement: " + error,
            };
        }
    }
    ```