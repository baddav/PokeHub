// PokeHub - JavaScript functionality
class PokeHub {
    constructor() {
        this.apiBase = 'https://pokeapi.co/api/v2';
        this.currentPage = 1;
        this.pokemonPerPage = 20;
        this.currentView = 'gallery';
        this.pokemonCache = new Map();
        
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadPokemonGallery();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
        });

        // Pagination
        document.getElementById('prev-page').addEventListener('click', () => this.previousPage());
        document.getElementById('next-page').addEventListener('click', () => this.nextPage());

        // Search
        document.getElementById('search-btn').addEventListener('click', () => this.searchPokemon());
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchPokemon();
        });

        // Modal
        document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
        document.getElementById('pokemon-modal').addEventListener('click', (e) => {
            if (e.target.id === 'pokemon-modal') this.closeModal();
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    switchView(view) {
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Show/hide views
        document.querySelectorAll('.view').forEach(viewEl => {
            viewEl.classList.toggle('hidden', viewEl.id !== `${view}-view`);
        });

        this.currentView = view;

        // Load data if needed
        if (view === 'gallery' && !document.getElementById('pokemon-grid').hasChildNodes()) {
            this.loadPokemonGallery();
        }
    }

    async loadPokemonGallery(page = 1) {
        this.showLoading();
        
        try {
            const offset = (page - 1) * this.pokemonPerPage;
            const response = await fetch(`${this.apiBase}/pokemon?limit=${this.pokemonPerPage}&offset=${offset}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch Pokémon data');
            }
            
            const data = await response.json();
            
            // Load detailed data for each Pokémon
            const pokemonDetails = await Promise.all(
                data.results.map(pokemon => this.fetchPokemonDetails(pokemon.url))
            );
            
            this.renderPokemonGrid(pokemonDetails);
            this.updatePaginationControls();
            
        } catch (error) {
            console.error('Error loading Pokémon gallery:', error);
            
            // Fallback to demo data if API is blocked (e.g., CORS in development)
            if (error.message.includes('fetch') || error.message.includes('CORS')) {
                console.log('API blocked, loading demo data...');
                this.loadDemoData();
            } else {
                this.showError('Failed to load Pokémon. Please try again.');
            }
        } finally {
            this.hideLoading();
        }
    }

    async fetchPokemonDetails(url) {
        // Check cache first
        if (this.pokemonCache.has(url)) {
            return this.pokemonCache.get(url);
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch Pokémon details from ${url}`);
            }
            
            const pokemon = await response.json();
            
            // Cache the result
            this.pokemonCache.set(url, pokemon);
            
            return pokemon;
        } catch (error) {
            console.error('Error fetching Pokémon details:', error);
            return null;
        }
    }

    renderPokemonGrid(pokemonList) {
        const grid = document.getElementById('pokemon-grid');
        grid.innerHTML = '';

        pokemonList.forEach(pokemon => {
            if (!pokemon) return; // Skip failed fetches
            
            const card = this.createPokemonCard(pokemon);
            grid.appendChild(card);
        });
    }

    createPokemonCard(pokemon) {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.addEventListener('click', () => this.showPokemonDetails(pokemon));

        const imageUrl = pokemon.sprites.other['official-artwork'].front_default || 
                        pokemon.sprites.front_default ||
                        'https://via.placeholder.com/150x150?text=No+Image';

        card.innerHTML = `
            <img src="${imageUrl}" alt="${pokemon.name}" class="pokemon-image" loading="lazy">
            <h3 class="pokemon-name">${pokemon.name}</h3>
            <p class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</p>
            <div class="pokemon-types">
                ${pokemon.types.map(type => 
                    `<span class="pokemon-type type-${type.type.name}">${type.type.name}</span>`
                ).join('')}
            </div>
        `;

        return card;
    }

    async searchPokemon() {
        const searchInput = document.getElementById('search-input');
        const query = searchInput.value.trim().toLowerCase();
        
        if (!query) {
            this.showError('Please enter a Pokémon name');
            return;
        }

        const resultContainer = document.getElementById('search-result');
        resultContainer.innerHTML = '<div class="loading"><div class="spinner"></div><p>Searching...</p></div>';

        try {
            const response = await fetch(`${this.apiBase}/pokemon/${query}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Pokémon not found. Please check the spelling and try again.');
                }
                throw new Error('Search failed. Please try again.');
            }

            const pokemon = await response.json();
            resultContainer.innerHTML = '';
            
            const card = this.createPokemonCard(pokemon);
            card.style.maxWidth = '400px';
            card.style.margin = '0 auto';
            
            resultContainer.appendChild(card);
            
        } catch (error) {
            console.error('Search error:', error);
            
            // Fallback for demo purposes
            if (error.message.includes('fetch') || error.message.includes('CORS')) {
                this.showDemoSearchResult(query, resultContainer);
            } else {
                resultContainer.innerHTML = `<div class="error-message">${error.message}</div>`;
            }
        }
    }

    showPokemonDetails(pokemon) {
        const modal = document.getElementById('pokemon-modal');
        const detailsContainer = document.getElementById('pokemon-details');
        
        const imageUrl = pokemon.sprites.other['official-artwork'].front_default || 
                        pokemon.sprites.front_default ||
                        'https://via.placeholder.com/200x200?text=No+Image';

        detailsContainer.innerHTML = `
            <img src="${imageUrl}" alt="${pokemon.name}" class="pokemon-detail-image">
            <h2 class="pokemon-detail-name">${pokemon.name}</h2>
            <p class="pokemon-detail-id">#${pokemon.id.toString().padStart(3, '0')}</p>
            
            <div class="types-list">
                ${pokemon.types.map(type => 
                    `<span class="pokemon-type type-${type.type.name}">${type.type.name}</span>`
                ).join('')}
            </div>
            
            <div class="pokemon-stats">
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
                            <span>${this.formatStatName(stat.stat.name)}</span>
                            <span>${stat.base_stat}</span>
                        </div>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${Math.min(stat.base_stat / 200 * 100, 100)}%"></div>
                        </div>
                    `).join('')}
                </div>
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

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('pokemon-modal');
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    formatStatName(name) {
        const statNames = {
            'hp': 'HP',
            'attack': 'Attack',
            'defense': 'Defense',
            'special-attack': 'Sp. Attack',
            'special-defense': 'Sp. Defense',
            'speed': 'Speed'
        };
        return statNames[name] || name;
    }

    updatePaginationControls() {
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageInfo = document.getElementById('page-info');

        prevBtn.disabled = this.currentPage === 1;
        pageInfo.textContent = `Page ${this.currentPage}`;
        
        // Note: PokéAPI has over 1000 Pokémon, so we'll allow many pages
        nextBtn.disabled = this.currentPage >= 50; // Limit to reasonable number
    }

    async previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            await this.loadPokemonGallery(this.currentPage);
        }
    }

    async nextPage() {
        this.currentPage++;
        await this.loadPokemonGallery(this.currentPage);
    }

    showLoading() {
        const loading = document.getElementById('loading');
        const grid = document.getElementById('pokemon-grid');
        
        loading.style.display = 'block';
        grid.style.display = 'none';
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        const grid = document.getElementById('pokemon-grid');
        
        loading.style.display = 'none';
        grid.style.display = 'grid';
    }

    showError(message) {
        const grid = document.getElementById('pokemon-grid');
        grid.innerHTML = `<div class="error-message" style="grid-column: 1 / -1;">${message}</div>`;
        this.hideLoading();
    }

    // Demo data for development/testing when API is blocked
    loadDemoData() {
        const demoPokemons = [
            {
                id: 1,
                name: 'bulbasaur',
                sprites: {
                    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
                    other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' }}
                },
                types: [{ type: { name: 'grass' }}, { type: { name: 'poison' }}],
                height: 7,
                weight: 69,
                base_experience: 64,
                stats: [
                    { stat: { name: 'hp' }, base_stat: 45 },
                    { stat: { name: 'attack' }, base_stat: 49 },
                    { stat: { name: 'defense' }, base_stat: 49 },
                    { stat: { name: 'special-attack' }, base_stat: 65 },
                    { stat: { name: 'special-defense' }, base_stat: 65 },
                    { stat: { name: 'speed' }, base_stat: 45 }
                ],
                abilities: [{ ability: { name: 'overgrow' }, is_hidden: false }, { ability: { name: 'chlorophyll' }, is_hidden: true }]
            },
            {
                id: 4,
                name: 'charmander',
                sprites: {
                    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
                    other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' }}
                },
                types: [{ type: { name: 'fire' }}],
                height: 6,
                weight: 85,
                base_experience: 62,
                stats: [
                    { stat: { name: 'hp' }, base_stat: 39 },
                    { stat: { name: 'attack' }, base_stat: 52 },
                    { stat: { name: 'defense' }, base_stat: 43 },
                    { stat: { name: 'special-attack' }, base_stat: 60 },
                    { stat: { name: 'special-defense' }, base_stat: 50 },
                    { stat: { name: 'speed' }, base_stat: 65 }
                ],
                abilities: [{ ability: { name: 'blaze' }, is_hidden: false }, { ability: { name: 'solar-power' }, is_hidden: true }]
            },
            {
                id: 7,
                name: 'squirtle',
                sprites: {
                    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
                    other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' }}
                },
                types: [{ type: { name: 'water' }}],
                height: 5,
                weight: 90,
                base_experience: 63,
                stats: [
                    { stat: { name: 'hp' }, base_stat: 44 },
                    { stat: { name: 'attack' }, base_stat: 48 },
                    { stat: { name: 'defense' }, base_stat: 65 },
                    { stat: { name: 'special-attack' }, base_stat: 50 },
                    { stat: { name: 'special-defense' }, base_stat: 64 },
                    { stat: { name: 'speed' }, base_stat: 43 }
                ],
                abilities: [{ ability: { name: 'torrent' }, is_hidden: false }, { ability: { name: 'rain-dish' }, is_hidden: true }]
            },
            {
                id: 25,
                name: 'pikachu',
                sprites: {
                    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
                    other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' }}
                },
                types: [{ type: { name: 'electric' }}],
                height: 4,
                weight: 60,
                base_experience: 112,
                stats: [
                    { stat: { name: 'hp' }, base_stat: 35 },
                    { stat: { name: 'attack' }, base_stat: 55 },
                    { stat: { name: 'defense' }, base_stat: 40 },
                    { stat: { name: 'special-attack' }, base_stat: 50 },
                    { stat: { name: 'special-defense' }, base_stat: 50 },
                    { stat: { name: 'speed' }, base_stat: 90 }
                ],
                abilities: [{ ability: { name: 'static' }, is_hidden: false }, { ability: { name: 'lightning-rod' }, is_hidden: true }]
            }
        ];

        this.renderPokemonGrid(demoPokemons);
        
        // Show demo notice
        const grid = document.getElementById('pokemon-grid');
        const notice = document.createElement('div');
        notice.style.cssText = 'grid-column: 1 / -1; background: #fef3c7; color: #92400e; padding: 1rem; border-radius: 8px; text-align: center; margin-bottom: 1rem;';
        notice.innerHTML = '🚀 <strong>Demo Mode:</strong> API access is blocked in this environment. Showing sample Pokémon data. Deploy to a server for full functionality!';
        grid.prepend(notice);
    }

    showDemoSearchResult(query, container) {
        const demoResults = {
            'pikachu': {
                id: 25,
                name: 'pikachu',
                sprites: {
                    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
                    other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' }}
                },
                types: [{ type: { name: 'electric' }}],
                height: 4,
                weight: 60,
                base_experience: 112,
                stats: [
                    { stat: { name: 'hp' }, base_stat: 35 },
                    { stat: { name: 'attack' }, base_stat: 55 },
                    { stat: { name: 'defense' }, base_stat: 40 },
                    { stat: { name: 'special-attack' }, base_stat: 50 },
                    { stat: { name: 'special-defense' }, base_stat: 50 },
                    { stat: { name: 'speed' }, base_stat: 90 }
                ],
                abilities: [{ ability: { name: 'static' }, is_hidden: false }, { ability: { name: 'lightning-rod' }, is_hidden: true }]
            }
        };

        if (demoResults[query]) {
            container.innerHTML = '';
            const card = this.createPokemonCard(demoResults[query]);
            card.style.maxWidth = '400px';
            card.style.margin = '0 auto';
            container.appendChild(card);
            
            // Add demo notice
            const notice = document.createElement('div');
            notice.style.cssText = 'background: #fef3c7; color: #92400e; padding: 0.75rem; border-radius: 8px; text-align: center; margin-top: 1rem;';
            notice.innerHTML = '🚀 <strong>Demo Mode:</strong> Try searching for "pikachu" to see the demo functionality!';
            container.appendChild(notice);
        } else {
            container.innerHTML = `
                <div class="error-message">
                    Demo mode: Only "pikachu" search is available. Deploy to a server for full search functionality!
                </div>
            `;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PokeHub();
});

// Service Worker for offline functionality (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered: ', registration))
            .catch(registrationError => console.log('SW registration failed: ', registrationError));
    });
}