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
            box.style.display = "flex";
        })
        .catch((err) => {
            // Logge einen Fehler in die Konsole, wenn das Pokémon nicht gefunden wird
            console.log("Pokemon not found", err);
            box.innerHTML = "";
            box.style.display = "none";
        });

    // Verhindere das Standardverhalten des Buttons (z. B. das Neuladen der Seite)
    e.preventDefault();
}


/* ----------------------------

   Tipp-Rotation

----------------------------- */

// 15 Tipps als Array

const tips = [

    "Lasse deine Pokémon gegeneinander kämpfen und finde heraus, wer der Stärkste ist.",

    "Verbessere deine Pokémon, indem du sie trainierst und ihre Fähigkeiten stärkst.",

    "Teile niemals dein Passwort mit Dritten – Sicherheit geht vor!",

    "Fange verschiedene Pokémon, um dein Team vielseitiger zu machen.",

    "Nutze Typvorteile, um Kämpfe einfacher zu gewinnen.",

    "Heile deine Pokémon regelmäßig im Pokémon-Center.",

    "Vergiss nicht, Pokébälle nachzukaufen – man weiß nie, wann ein seltenes Pokémon auftaucht!",

    "Baue ein Team mit einer guten Balance aus Angriff und Verteidigung.",

    "Experimentiere mit verschiedenen Attacken-Kombinationen.",

    "Einige Pokémon entwickeln sich nur durch bestimmte Items – probiere es aus!",

    "Tausche Pokémon mit Freunden, um deinen Pokédex schneller zu füllen.",

    "Achte auf die Wetterbedingungen – manche Pokémon erscheinen nur unter bestimmten Bedingungen.",

    "Legendäre Pokémon sind besonders stark, aber schwer zu fangen.",

    "Trainiere nicht nur ein Pokémon – ein ausgewogenes Team kann besser sein.",

    "Setze Status-Effekte wie Schlaf oder Paralyse strategisch im Kampf ein."

];

// Alle Tipp-Elemente auswählen

const tipElements = document.querySelectorAll(".tip-card p");

let currentTipIndex = 0;

function changeTips() {

    tipElements.forEach((el, i) => {

        // Jeder Tipp bekommt einen eigenen Offset

        const tipIndex = (currentTipIndex + i) % tips.length;

        el.textContent = tips[tipIndex];

    });

    currentTipIndex = (currentTipIndex + tipElements.length) % tips.length;

}

// Starte sofort mit den ersten Tipps

changeTips();

// Alle 12 Sekunden rotieren

setInterval(changeTips, 12000);
