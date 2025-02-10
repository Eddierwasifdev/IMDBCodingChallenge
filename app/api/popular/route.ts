import { NextResponse } from "next/server";

export async function GET() {
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const OMDB_API_KEY = process.env.OMDB_API_KEY;

  if (!TMDB_API_KEY || !OMDB_API_KEY) {
    return NextResponse.json({
      Response: "False",
      Error: "API keys not configured",
    });
  }

  try {
    // Fetch popular movies from TMDB
    const tmdbResponse = await fetch(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          accept: "application/json",
        },
      }
    );

    if (!tmdbResponse.ok) {
      throw new Error(`TMDB API responded with status: ${tmdbResponse.status}`);
    }

    const tmdbData = await tmdbResponse.json();

    // Get IMDb IDs for each movie
    const moviesWithImdbIds = await Promise.all(
      tmdbData.results
        .slice(0, 12)
        .map(
          async (movie: {
            id: number;
            title: string;
            release_date: string;
            poster_path: string;
          }) => {
            const detailsResponse = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}/external_ids`,
              {
                headers: {
                  Authorization: `Bearer ${TMDB_API_KEY}`,
                  accept: "application/json",
                },
              }
            );
            const details = await detailsResponse.json();

            // Get OMDB data for additional details
            await fetch(
              `https://www.omdbapi.com/?i=${details.imdb_id}&apikey=${OMDB_API_KEY}`
            );

            return {
              imdbID: details.imdb_id,
              Title: movie.title,
              Year: new Date(movie.release_date).getFullYear().toString(),
              Poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            };
          }
        )
    );

    return NextResponse.json({ Search: moviesWithImdbIds });
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular movies" },
      { status: 500 }
    );
  }
}
