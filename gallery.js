const gallery = document.querySelector('.pokemon-gallery');
const loadMoreButton = document.querySelector('.load-more');
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

function renderPokemonCards(data) {
    data.forEach((pokemon) => {
        const card = document.createElement('div');
        card.classList.add('pokemon-card');
        card.dataset.id = pokemon.id;
        card.dataset.name = pokemon.name;
        card.dataset.type = pokemon.types[0].type.name;

        card.innerHTML = `
            <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
        `;

        // Create the stats section
        const statsSection = document.createElement('div');
        statsSection.classList.add('pokemon-stats');
        statsSection.innerHTML = `
            <div class="stat-group">
                <h4>Physical Info</h4>
                <div class="stat-item">
                    <span>Height</span>
                    <span>${(pokemon.height / 10).toFixed(1)} m</span>
                </div>
                <div class="stat-item">
                    <span>Weight</span>
                    <span>${(pokemon.weight / 10).toFixed(1)} kg</span>
                </div>
                <div class="stat-item">
                    <span>Base Experience</span>
                    <span>${pokemon.base_experience || 'Unknown'}</span>
                </div>
            </div>
            <div class="stat-group">
                <h4>Base Stats</h4>
                ${pokemon.stats.map(stat => `
                    <div class="stat-item">
                        <span>${formatStatName(stat.stat.name)}</span>
                        <span>${stat.base_stat}</span>
                    </div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${Math.min(stat.base_stat / 200 * 100, 100)}%"></div>
                    </div>
                `).join('')}
            </div>
            <div class="stat-group">
                <h4>Abilities</h4>
                <div class="abilities-list">
                    ${pokemon.abilities.map(ability =>
            `<span class="ability">${ability.ability.name}${ability.is_hidden ? ' (Hidden)' : ''}</span>`
        ).join('')}
                </div>
            </div>
        `;

        // Hide stats section by default
        statsSection.style.display = 'none';
        card.appendChild(statsSection);

        // Event listener for fullscreen mode
        card.addEventListener('click', () => {
            const isFullscreen = card.classList.contains('fullscreen');

            // Remove fullscreen from other cards
            document.querySelectorAll('.pokemon-card.fullscreen').forEach((fullscreenCard) => {
                fullscreenCard.classList.remove('fullscreen');
                fullscreenCard.querySelector('.pokemon-stats').style.display = 'none';
            });
            document.querySelectorAll('.overlay.active').forEach((overlay) => {
                overlay.classList.remove('active');
            });

            if (!isFullscreen) {
                // Add fullscreen class and show stats
                card.classList.add('fullscreen');
                statsSection.style.display = 'block';

                // Create and activate overlay
                let overlay = document.querySelector('.overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.classList.add('overlay');
                    document.body.appendChild(overlay);
                }
                overlay.classList.add('active');

                // Close fullscreen on overlay click
                overlay.addEventListener('click', () => {
                    card.classList.remove('fullscreen');
                    statsSection.style.display = 'none';
                    overlay.classList.remove('active');
                });
            }
        });

        gallery.appendChild(card);
    });
}

// Helper function to format stat names
function formatStatName(name) {
    return name.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
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

// Event-Listener für den "Load More"-Button
loadMoreButton.addEventListener('click', loadMorePokemon);

// Initialer API-Aufruf
fetchPokemonData(nextUrl);