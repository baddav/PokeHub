const filters = document.querySelector('.filters');
const typeFilter = document.getElementById('typeFilter');
const stageFilter = document.getElementById('stageFilter');
const sortFilter = document.getElementById('sortFilter');
const gallery = document.querySelector('.pokemon-gallery');
const loadMoreButton = document.querySelector('.load-more');
let lastScrollY = window.scrollY;
let nextUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20';

// Funktion, um Pokémon-Daten von der API abzurufen
async function fetchPokemonData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        nextUrl = data.next; // Speichere die URL für die nächste Seite
        const pokemonDetails = await Promise.all(
            data.results.map(async (pokemon) => {
                const res = await fetch(pokemon.url);
                return res.json();
            })
        );
        renderPokemonCards(pokemonDetails);
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
}

// Funktion, um Pokémon-Karten zu rendern
function renderPokemonCards(data) {
    data.forEach((pokemon) => {
        const card = document.createElement('div');
        card.classList.add('pokemon-card');
        card.dataset.id = pokemon.id;
        card.dataset.name = pokemon.name;
        card.dataset.type = pokemon.types[0].type.name;
        card.dataset.stage = 'base'; // Die API liefert keine Evolutionsstufe, daher Standardwert

        card.innerHTML = `
            <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
        `;
        gallery.appendChild(card);
    });
}

// Funktion, um weitere Pokémon zu laden
function loadMorePokemon() {
    if (nextUrl) {
        fetchPokemonData(nextUrl);
    } else {
        loadMoreButton.disabled = true;
        loadMoreButton.textContent = 'No more Pokémon';
    }
}

// Scroll-Verhalten für die Filterleiste
window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
        filters.classList.add('hidden'); // Verstecke Filter beim Herunterscrollen
    } else {
        filters.classList.remove('hidden'); // Zeige Filter beim Hochscrollen
    }
    lastScrollY = window.scrollY;
});

// Event-Listener für den "Load More"-Button
loadMoreButton.addEventListener('click', loadMorePokemon);

// Initialer API-Aufruf
fetchPokemonData(nextUrl);