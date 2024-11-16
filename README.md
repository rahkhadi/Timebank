
# PopcornBuddy

PopcornBuddy is a movie information web app that allows users to discover trending, popular, top-rated, and upcoming movies. Users can also manage their favorite movies and watchlist. This project is built using Next.js, Tailwind CSS, MongoDB and the TMDB API.

## Table of Contents

- [Features](#features)
- [Deployment](#deployment)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Components](#components)
- [Styling](#styling)
- [Contributing](#contributing)
- [Credits](#credits)

## Features

- **Movie Discovery**: Browse trending, popular, top-rated, and upcoming movies.
- **Movie Details**: View detailed information about each movie, including release date, genres, runtime, and overview.
- **Favorites & Watchlist**: Users can add movies to their favorites and watchlist.
- **Responsive Design**: Optimized for both desktop and mobile screens.
- **User Authentication**: Sign up, log in, and manage personal movie lists.

## Deployment
- The website is deployed on Vercel. You can visit the live site at: https://popcornbuddy.vercel.app/.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v12.x or later)
- [npm](https://www.npmjs.com/) (v6.x or later) or [yarn](https://yarnpkg.com/) (v1.x or later)

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/popcornbuddy.git
cd popcornbuddy
npm install
```

### Running the Project

To start the development server:

```bash
npm run dev
```

Visit 'http://localhost:3000' in your browser to view the app.

## Environment Variables

Create a '.env.local' file in the root directory and add your TMDB API key:

```bash
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

## API Integration

This project uses the [TMDB API](https://www.themoviedb.org/documentation/api) to fetch movie data. 

- **Popular Movies**: 'movie/popular'
- **Top Rated Movies**: '/movie/top_rated'
- **Now Playing Movies**: '/movie/now_playing'
- **Upcoming Movies**: '/movie/upcoming'
- **Movie Details**: '/movie/{movie_id}'
- **Genres**: '/genre/movie/list'

Ensure your API key is correctly configured in the '.env.local' file.

## Components

### NavBar

The 'NavBar' component provides navigation across different pages, including Trending, Genre, and Top Rated movies. It also includes search functionality.

### MovieCard

The 'MovieCard' component is used across multiple pages to display individual movie information such as title, release year, genres, and poster image. It also includes buttons for adding movies to favorites and watchlists.

## Styling

This project uses **Tailwind CSS** for responsive and utility-first styling. Additional custom styles are defined in the 'styles' directory using CSS modules.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch ('git checkout -b feature/your-feature-name').
3. Make your changes.
4. Commit your changes ('git commit -m 'Add some feature'').
5. Push to the branch ('git push origin feature/your-feature-name').
6. Open a pull request.

## Credits

This project was developed by the following collaborators:

- **[Mike Dohyun Lim](https://github.com/mikeylim)**: Frontend/Backend Developer
- **[Claudia Suarez](https://github.com/cSuarez13)**: Frontend/Backend Developer
- **[Gaganjot Singh](https://github.com/GJSI)**: Frontend/Backend Developer

Special thanks to the [TMDB API](https://www.themoviedb.org/documentation/api) for providing the movie data used in this project.
