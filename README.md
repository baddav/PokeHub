# PokeHub - Pokémon Explorer

A modern, responsive web application for exploring and discovering Pokémon using the [PokéAPI](https://pokeapi.co/). Built with vanilla HTML, CSS, and JavaScript.

## Features

- **🎨 Modern UI**: Clean, responsive design with smooth animations and transitions
- **📱 Mobile-First**: Fully responsive design that works on all device sizes
- **🔍 Search Functionality**: Search for any Pokémon by name with instant results
- **📊 Detailed Information**: View comprehensive Pokémon stats, abilities, types, and more
- **🖼️ Gallery View**: Browse Pokémon in a beautiful grid layout with pagination
- **⚡ Fast Loading**: Efficient caching and optimized API calls
- **🎯 Type System**: Color-coded Pokémon types with proper styling
- **📈 Stats Visualization**: Visual stat bars and comprehensive information display

## Technologies Used

- **HTML5**: Semantic markup and accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: ES6+ features with async/await and modern APIs
- **PokéAPI**: RESTful API for Pokémon data
- **Service Worker**: Basic offline support and caching

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/baddav/PokeHub.git
   cd PokeHub
   ```

2. Open `index.html` in your browser or serve it using a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (with serve package)
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Navigate to `http://localhost:8000` in your browser

## Project Structure

```
PokeHub/
├── index.html          # Main HTML file
├── styles.css          # All styling and responsive design
├── script.js           # JavaScript functionality and API integration
├── sw.js              # Service Worker for caching
└── README.md          # Project documentation
```

## Features Overview

### Gallery View
- Browse Pokémon in a responsive grid layout
- Pagination controls for easy navigation
- Each card shows Pokémon image, name, ID, and types
- Hover effects and smooth animations

### Search Functionality
- Search for Pokémon by exact name
- Real-time error handling for invalid searches
- Clean results display with detailed information

### Detailed Pokemon View
- Modal popup with comprehensive Pokémon information
- High-quality official artwork
- Complete base stats with visual bars
- Physical information (height, weight, base experience)
- Abilities list with hidden ability indicators
- Type badges with authentic colors

### Responsive Design
- Mobile-first approach
- Optimized layouts for tablets and desktops
- Touch-friendly interface
- Accessible design patterns

## API Integration

This project uses the [PokéAPI](https://pokeapi.co/) which provides:
- Comprehensive Pokémon data
- High-quality images and artwork
- No authentication required
- RESTful API design
- Reliable and fast responses

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Performance Features

- **Lazy Loading**: Images load only when needed
- **Caching**: API responses cached for better performance
- **Service Worker**: Basic offline support
- **Optimized Images**: Uses best available image sources
- **Efficient API Calls**: Batch requests and smart pagination

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing free Pokémon data
- [Google Fonts](https://fonts.google.com/) for the Inter font family
- Pokémon images and data are © Nintendo/Game Freak

## Live Demo

Visit the live demo: [PokeHub](https://your-username.github.io/PokeHub)