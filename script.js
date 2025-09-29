// Füge einen Event-Listener hinzu, der die Funktion `getPokemon` ausführt, wenn der Button mit der ID "search" geklickt wird
document.querySelector('#search').addEventListener('click', getPokemon);

// Funktion, die ausgeführt wird, wenn der Button geklickt wird
function getPokemon(e) {
    // Hole den Wert aus dem Eingabefeld mit der ID "pokemonName"
    const name = document.querySelector('#pokemonName').value;
    const box = document.querySelector(".pokemonBox"); /*Für enter*/

    // Sende eine Anfrage an die Pokémon-API, um Daten für das eingegebene Pokémon zu erhalten
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then((response) => response.json()) // Konvertiere die Antwort in JSON
        .then((data) => {
            box.style.display = "flex"; /*Für enter*/
            // Aktualisiere den Inhalt des Elements mit der Klasse "pokemonBox", um die Pokémon-Daten anzuzeigen
            box.innerHTML =  `
            <div>
                <!-- Zeige das Bild des Pokémon an -->
                <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
            </div>
            <div class="pokemonInfo">
                <!-- Zeige den Namen und das Gewicht des Pokémon an -->
                <h1>${data.name}</h1>
                <p>${data.weight}</p>
            </div>
            `;
        })
        .catch((err) => {
            // Logge einen Fehler in die Konsole, wenn das Pokémon nicht gefunden wird
            console.log("Pokemon not found", err);
            box.style.display = "none";
        });

    // Verhindere das Standardverhalten des Buttons (z. B. das Neuladen der Seite)
    e.preventDefault();
}

