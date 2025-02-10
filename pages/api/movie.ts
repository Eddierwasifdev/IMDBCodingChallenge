// pages/api/movie.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Movie ID is required" });
  }

  // Check if the ID is a valid IMDB ID (starts with 'tt')
  if (!id.toString().startsWith("tt")) {
    return res.status(400).json({ error: "Invalid IMDB ID format" });
  }

  const OMDB_API_KEY = process.env.OMDB_API_KEY;

  if (!OMDB_API_KEY) {
    return res.status(500).json({ error: "OMDB API key is not configured" });
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?i=${id}&apikey=${OMDB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`OMDB API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.Error) {
      return res.status(404).json({ error: data.Error });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return res.status(500).json({ error: "Failed to fetch movie details" });
  }
}
